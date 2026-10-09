from __future__ import annotations

import csv
import json
from collections import Counter, deque
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urljoin, urlparse

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from downloader import ImageDownloader
from extractor import extract_page_data
from utils import (
    classify_page_type,
    ensure_unique_slug,
    get_logger,
    get_root_domain,
    is_same_domain,
    normalize_url,
    should_ignore_link,
    summarize_text,
    url_to_slug,
)


@dataclass
class CrawlConfig:
    start_url: str
    output_dir: Path = Path("output")
    timeout: tuple[int, int] = (8, 20)
    user_agent: str = "SiteMigrationBackupBot/1.0 (+manual-run)"
    max_pages: int = 1200
    use_playwright_fallback: bool = False


class SiteCrawler:
    def __init__(self, config: CrawlConfig) -> None:
        self.config = config
        self.logger = get_logger("crawler")

        self.start_url = normalize_url(config.start_url)
        self.allowed_root_domain = get_root_domain(urlparse(self.start_url).netloc)

        self.output_dir = config.output_dir
        self.html_dir = self.output_dir / "html"
        self.json_dir = self.output_dir / "json"
        self.images_dir = self.output_dir / "images"
        for directory in (self.output_dir, self.html_dir, self.json_dir, self.images_dir):
            directory.mkdir(parents=True, exist_ok=True)

        self.session = self._build_session(config.user_agent)
        self.image_downloader = ImageDownloader(self.images_dir, self.session, timeout=config.timeout)

        self.visited: set[str] = set()
        self.slug_map: dict[str, str] = {}
        self.errors: list[dict[str, str]] = []
        self.sitemap_entries: list[dict[str, Any]] = []
        self.csv_rows: list[dict[str, str]] = []

        self._playwright = None
        self._browser = None
        self._browser_context = None

    def _build_session(self, user_agent: str) -> requests.Session:
        retries = Retry(
            total=3,
            read=3,
            connect=3,
            backoff_factor=0.6,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=("GET", "HEAD"),
            raise_on_status=False,
        )
        adapter = HTTPAdapter(max_retries=retries)

        session = requests.Session()
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        session.headers.update(
            {
                "User-Agent": user_agent,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
            }
        )
        return session

    def _init_playwright(self) -> bool:
        if self._browser_context:
            return True
        try:
            from playwright.sync_api import sync_playwright

            self._playwright = sync_playwright().start()
            self._browser = self._playwright.chromium.launch(headless=True)
            self._browser_context = self._browser.new_context(user_agent=self.config.user_agent)
            self.logger.info("Fallback Playwright habilitado.")
            return True
        except Exception as exc:  # noqa: BLE001
            self.errors.append({"url": "<playwright>", "error": str(exc), "stage": "playwright_init"})
            self.logger.warning("Nao foi possivel iniciar Playwright: %s", exc)
            return False

    def _fetch_with_playwright(self, url: str) -> str:
        if not self._init_playwright():
            raise RuntimeError("Playwright indisponivel para fallback")

        page = self._browser_context.new_page()
        try:
            page.goto(url, wait_until="networkidle", timeout=30000)
            return page.content()
        finally:
            page.close()

    def _fetch_page(self, url: str) -> str:
        response = self.session.get(url, timeout=self.config.timeout)
        response.raise_for_status()
        return response.text

    def fetch_page(self, url: str) -> str | None:
        try:
            return self._fetch_page(url)
        except Exception as exc:  # noqa: BLE001
            self.logger.warning("Falha via requests em %s: %s", url, exc)
            if self.config.use_playwright_fallback:
                try:
                    self.logger.info("Tentando fallback Playwright: %s", url)
                    return self._fetch_with_playwright(url)
                except Exception as pw_exc:  # noqa: BLE001
                    self.errors.append({"url": url, "error": str(pw_exc), "stage": "fetch_playwright"})
                    self.logger.error("Falha no fallback Playwright em %s: %s", url, pw_exc)
                    return None
            self.errors.append({"url": url, "error": str(exc), "stage": "fetch_requests"})
            return None

    def inspect_robots(self) -> None:
        robots_url = urljoin(self.start_url, "/robots.txt")
        self.logger.info("Conferindo robots.txt (nao bloqueia execucao): %s", robots_url)
        try:
            response = self.session.get(robots_url, timeout=self.config.timeout)
            if response.status_code >= 400:
                self.logger.info("robots.txt nao encontrado (status %s).", response.status_code)
                return

            lines = [line.strip() for line in response.text.splitlines() if line.strip()]
            disallow = [line for line in lines if line.lower().startswith("disallow:")]
            sitemap = [line for line in lines if line.lower().startswith("sitemap:")]
            self.logger.info("robots.txt lido: %s regras Disallow, %s entradas Sitemap.", len(disallow), len(sitemap))
        except Exception as exc:  # noqa: BLE001
            self.errors.append({"url": robots_url, "error": str(exc), "stage": "robots"})
            self.logger.warning("Falha ao ler robots.txt: %s", exc)

    def _save_html(self, slug: str, html: str) -> str:
        target = self.html_dir / f"{slug}.html"
        target.write_text(html, encoding="utf-8")
        return str(target)

    def _save_json(self, slug: str, data: dict[str, Any]) -> str:
        target = self.json_dir / f"{slug}.json"
        target.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        return str(target)

    def _collect_csv_row(self, page_type: str, url: str, slug: str, title: str, main_text: str, meta_description: str) -> None:
        summary = meta_description or summarize_text(main_text)
        self.csv_rows.append(
            {
                "tipo_pagina": page_type,
                "url": url,
                "slug": slug,
                "titulo": title,
                "resumo": summary,
            }
        )

    def _write_csv_index(self) -> None:
        target = self.output_dir / "pages_index.csv"
        with target.open("w", encoding="utf-8", newline="") as csvfile:
            fieldnames = ["tipo_pagina", "url", "slug", "titulo", "resumo"]
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(self.csv_rows)

    def _write_sitemap(self) -> None:
        target = self.output_dir / "sitemap.json"
        target.write_text(
            json.dumps(
                {
                    "base_url": self.start_url,
                    "total_paginas": len(self.sitemap_entries),
                    "paginas": self.sitemap_entries,
                },
                ensure_ascii=False,
                indent=2,
            ),
            encoding="utf-8",
        )

    def _write_summary(self) -> None:
        pages_by_type = Counter(item["tipo"] for item in self.sitemap_entries)
        summary = {
            "total_paginas": len(self.sitemap_entries),
            "total_imagens": len(self.image_downloader.downloaded),
            "paginas_por_tipo": dict(sorted(pages_by_type.items())),
            "erros_encontrados": self.errors + self.image_downloader.errors,
        }

        target = self.output_dir / "summary.json"
        target.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

    def _close_playwright(self) -> None:
        if self._browser_context:
            self._browser_context.close()
        if self._browser:
            self._browser.close()
        if self._playwright:
            self._playwright.stop()

    def crawl(self) -> None:
        self.inspect_robots()
        queue: deque[str] = deque([self.start_url])
        queued: set[str] = {self.start_url}

        self.logger.info("Inicio do crawl: %s", self.start_url)
        while queue and len(self.visited) < self.config.max_pages:
            current_url = queue.popleft()
            if current_url in self.visited:
                continue

            self.logger.info("Visitando (%s/%s): %s", len(self.visited) + 1, self.config.max_pages, current_url)
            html = self.fetch_page(current_url)
            self.visited.add(current_url)
            if not html:
                continue

            slug = ensure_unique_slug(url_to_slug(current_url), current_url, self.slug_map)
            self._save_html(slug, html)

            extracted = extract_page_data(current_url, html, self.allowed_root_domain)
            extracted["images"] = self.image_downloader.attach_local_paths(extracted["images"])
            extracted["slug"] = slug

            page_type = classify_page_type(current_url)
            self._save_json(slug, extracted)
            self._collect_csv_row(
                page_type=page_type,
                url=current_url,
                slug=slug,
                title=extracted["title"],
                main_text=extracted["main_text"],
                meta_description=extracted["meta_description"],
            )

            self.sitemap_entries.append(
                {
                    "url": current_url,
                    "slug": slug,
                    "tipo": page_type,
                    "titulo": extracted["title"],
                    "links_internos": len(extracted["links"]["internal"]),
                    "links_externos": len(extracted["links"]["external"]),
                    "imagens": len(extracted["images"]),
                }
            )

            for link in extracted["links"]["internal"]:
                if should_ignore_link(link):
                    continue
                normalized = normalize_url(link)
                if not is_same_domain(normalized, self.allowed_root_domain):
                    continue
                if normalized in self.visited or normalized in queued:
                    continue
                queue.append(normalized)
                queued.add(normalized)

        self._write_csv_index()
        self._write_sitemap()
        self._write_summary()
        self._close_playwright()
        self.logger.info("Crawl finalizado. Paginas processadas: %s", len(self.sitemap_entries))
