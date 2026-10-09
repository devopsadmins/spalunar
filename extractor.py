from __future__ import annotations

import re
from typing import Any

from bs4 import BeautifulSoup

from utils import is_same_domain, normalize_url, should_ignore_link

NOISY_TAGS = {"script", "style", "noscript", "svg", "form", "iframe", "canvas", "header", "footer", "nav", "aside"}
NOISY_KEYWORDS = {
    "menu",
    "footer",
    "rodape",
    "sidebar",
    "widget",
    "social",
    "cookie",
    "newsletter",
    "share",
    "whatsapp",
    "instagram",
}


def _clean_text_lines(text: str) -> str:
    lines = [line.strip() for line in text.splitlines()]
    lines = [line for line in lines if line]

    deduped: list[str] = []
    for line in lines:
        if deduped and deduped[-1] == line:
            continue
        deduped.append(line)

    return "\n".join(deduped)


def _is_noisy_element(class_or_id_text: str) -> bool:
    lowered = class_or_id_text.lower()
    return any(keyword in lowered for keyword in NOISY_KEYWORDS)


def _pick_main_container(soup: BeautifulSoup) -> BeautifulSoup:
    candidates = [
        soup.find("main"),
        soup.find("article"),
        soup.find(attrs={"role": "main"}),
        soup.find("div", class_=re.compile(r"content|conteudo|post|entry|article", re.I)),
    ]

    for candidate in candidates:
        if candidate:
            return BeautifulSoup(str(candidate), "lxml")

    body = soup.find("body")
    return BeautifulSoup(str(body if body else soup), "lxml")


def _remove_noise(container: BeautifulSoup) -> None:
    for tag in container.find_all(NOISY_TAGS):
        tag.decompose()

    # BeautifulSoup nodes can become invalid after decompose operations.
    for tag in list(container.find_all(True)):
        attrs = getattr(tag, "attrs", None)
        if attrs is None:
            continue

        class_attr = tag.get("class", [])
        class_name = " ".join(class_attr) if isinstance(class_attr, list) else str(class_attr)
        element_id = tag.get("id", "")
        if class_name and _is_noisy_element(class_name):
            tag.decompose()
            continue
        if element_id and _is_noisy_element(element_id):
            tag.decompose()


def _extract_breadcrumbs(soup: BeautifulSoup, page_url: str) -> list[str]:
    breadcrumbs = []
    selectors = [
        "nav[aria-label*='breadcrumb' i]",
        ".breadcrumb",
        ".breadcrumbs",
        "[typeof='BreadcrumbList']",
    ]

    node = None
    for selector in selectors:
        node = soup.select_one(selector)
        if node:
            break

    if not node:
        return breadcrumbs

    for item in node.find_all(["a", "span", "li"]):
        text = item.get_text(" ", strip=True)
        if text:
            breadcrumbs.append(text)

    # Remove repetições mantendo ordem.
    unique = []
    seen = set()
    for crumb in breadcrumbs:
        key = crumb.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(crumb)

    return unique


def _extract_links(
    container: BeautifulSoup,
    page_url: str,
    allowed_root_domain: str,
) -> tuple[list[str], list[str]]:
    internal_links: list[str] = []
    external_links: list[str] = []

    for anchor in container.find_all("a", href=True):
        href = anchor.get("href", "").strip()
        if not href or href.startswith("#"):
            continue
        if should_ignore_link(href):
            continue

        absolute = normalize_url(href, base_url=page_url)
        if should_ignore_link(absolute):
            continue

        if is_same_domain(absolute, allowed_root_domain):
            internal_links.append(absolute)
        else:
            external_links.append(absolute)

    def dedupe(values: list[str]) -> list[str]:
        return list(dict.fromkeys(values))

    return dedupe(internal_links), dedupe(external_links)


def _extract_images(container: BeautifulSoup, page_url: str) -> list[dict[str, str]]:
    images: list[dict[str, str]] = []
    seen = set()

    for image in container.find_all("img"):
        src = (
            image.get("src")
            or image.get("data-src")
            or image.get("data-lazy-src")
            or image.get("srcset", "").split(",")[0].strip().split(" ")[0]
        )
        if not src:
            continue
        absolute_src = normalize_url(src, base_url=page_url)
        if absolute_src in seen or should_ignore_link(absolute_src):
            continue
        seen.add(absolute_src)
        images.append(
            {
                "alt": image.get("alt", "").strip(),
                "src_original": absolute_src,
                "local_path": None,
            }
        )

    return images


def extract_page_data(page_url: str, html: str, allowed_root_domain: str) -> dict[str, Any]:
    soup = BeautifulSoup(html, "lxml")
    container = _pick_main_container(soup)
    _remove_noise(container)

    title = ""
    if soup.title and soup.title.string:
        title = soup.title.string.strip()

    meta_description = ""
    meta_tag = soup.find("meta", attrs={"name": re.compile(r"description", re.I)})
    if meta_tag:
        meta_description = (meta_tag.get("content") or "").strip()

    h1 = [tag.get_text(" ", strip=True) for tag in container.find_all("h1")]
    h2 = [tag.get_text(" ", strip=True) for tag in container.find_all("h2")]
    h3 = [tag.get_text(" ", strip=True) for tag in container.find_all("h3")]

    text_main = _clean_text_lines(container.get_text("\n", strip=True))
    breadcrumbs = _extract_breadcrumbs(soup, page_url)
    internal_links, external_links = _extract_links(container, page_url, allowed_root_domain)
    images = _extract_images(container, page_url)

    return {
        "url": page_url,
        "title": title,
        "meta_description": meta_description,
        "headings": {
            "h1": list(dict.fromkeys(h1)),
            "h2": list(dict.fromkeys(h2)),
            "h3": list(dict.fromkeys(h3)),
        },
        "breadcrumbs": breadcrumbs,
        "main_text": text_main,
        "links": {
            "internal": internal_links,
            "external": external_links,
        },
        "images": images,
    }
