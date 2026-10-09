from __future__ import annotations

import hashlib
import logging
import re
import unicodedata
from pathlib import Path
from urllib.parse import ParseResult, parse_qsl, urljoin, urlparse, urlunparse

IGNORED_SCHEMES = {"mailto", "tel", "javascript", "data"}
IGNORED_HOST_KEYWORDS = {
    "whatsapp",
    "wa.me",
    "instagram",
    "youtube",
    "youtu.be",
    "tiktok",
}
TRACKING_QUERY_PREFIXES = ("utm_", "fbclid", "gclid")


def setup_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(message)s",
        datefmt="%H:%M:%S",
    )


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)


def clean_query(parsed: ParseResult) -> str:
    filtered = []
    for key, value in parse_qsl(parsed.query, keep_blank_values=True):
        if any(key.lower().startswith(prefix) for prefix in TRACKING_QUERY_PREFIXES):
            continue
        filtered.append((key, value))
    if not filtered:
        return ""
    return "&".join(f"{k}={v}" if v else k for k, v in filtered)


def normalize_url(url: str, base_url: str | None = None) -> str:
    if base_url:
        url = urljoin(base_url, url)

    parsed = urlparse(url)
    scheme = parsed.scheme.lower() or "https"
    netloc = parsed.netloc.lower()

    path = re.sub(r"/{2,}", "/", parsed.path or "/")
    if path != "/" and path.endswith("/"):
        path = path[:-1]

    query = clean_query(parsed)
    normalized = ParseResult(
        scheme=scheme,
        netloc=netloc,
        path=path,
        params="",
        query=query,
        fragment="",
    )
    return urlunparse(normalized)


def get_root_domain(hostname: str) -> str:
    return hostname.lower().removeprefix("www.")


def is_same_domain(url: str, allowed_root_domain: str) -> bool:
    host = urlparse(url).netloc.lower()
    host_root = get_root_domain(host)
    return host_root == allowed_root_domain


def should_ignore_link(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme.lower() in IGNORED_SCHEMES:
        return True

    host = parsed.netloc.lower()
    if not host:
        return False

    return any(keyword in host for keyword in IGNORED_HOST_KEYWORDS)


def slugify_text(text: str) -> str:
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    ascii_text = ascii_text.lower()
    ascii_text = re.sub(r"[^a-z0-9]+", "-", ascii_text)
    ascii_text = re.sub(r"-+", "-", ascii_text).strip("-")
    return ascii_text or "page"


def url_to_slug(url: str) -> str:
    parsed = urlparse(url)
    if parsed.path in ("", "/") and not parsed.query:
        return "home"

    path_slug = slugify_text(parsed.path.strip("/"))
    if not parsed.query:
        return path_slug

    query_hash = hashlib.md5(parsed.query.encode("utf-8")).hexdigest()[:8]
    return f"{path_slug}-q-{query_hash}"


def ensure_unique_slug(slug: str, url: str, seen_slugs: dict[str, str]) -> str:
    existing = seen_slugs.get(slug)
    if existing is None or existing == url:
        seen_slugs[slug] = url
        return slug

    suffix = hashlib.md5(url.encode("utf-8")).hexdigest()[:6]
    unique = f"{slug}-{suffix}"
    seen_slugs[unique] = url
    return unique


def safe_filename(name: str, default_ext: str = ".bin") -> str:
    stem = Path(name).stem or "asset"
    ext = Path(name).suffix or default_ext
    stem = slugify_text(stem)
    return f"{stem}{ext.lower()}"


def classify_page_type(url: str) -> str:
    path = urlparse(url).path.lower().strip("/")
    if not path:
        return "home"

    segments = [segment for segment in path.split("/") if segment]
    first = segments[0] if segments else ""

    if first in {"blog", "artigos", "noticias"}:
        return "post" if len(segments) > 1 else "blog"
    if first in {"servicos", "servicos-esteticos", "tratamentos"}:
        return "servico" if len(segments) > 1 else "servico"
    if first in {"categoria", "categorias", "tag", "tags"}:
        return "categoria"
    if first in {"contato", "fale-conosco"}:
        return "contato"
    if first in {"empresa", "sobre", "sobre-nos", "depoimentos", "institucional"}:
        return "institucional"

    return "institucional"


def summarize_text(text: str, max_len: int = 180) -> str:
    compact = re.sub(r"\s+", " ", text).strip()
    if len(compact) <= max_len:
        return compact
    return compact[: max_len - 1].rstrip() + "…"
