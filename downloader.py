from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests

from utils import get_logger, safe_filename


class ImageDownloader:
    def __init__(
        self,
        output_dir: Path,
        session: requests.Session,
        timeout: tuple[int, int] = (8, 20),
    ) -> None:
        self.logger = get_logger("downloader")
        self.output_dir = output_dir
        self.session = session
        self.timeout = timeout
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.downloaded: dict[str, str] = {}
        self.errors: list[dict[str, str]] = []

    def _guess_extension(self, content_type: str | None) -> str:
        if not content_type:
            return ".bin"
        content_type = content_type.lower()
        if "jpeg" in content_type or "jpg" in content_type:
            return ".jpg"
        if "png" in content_type:
            return ".png"
        if "webp" in content_type:
            return ".webp"
        if "gif" in content_type:
            return ".gif"
        if "svg" in content_type:
            return ".svg"
        return ".bin"

    def download_image(self, image_url: str) -> str | None:
        if image_url in self.downloaded:
            return self.downloaded[image_url]

        parsed = urlparse(image_url)
        if parsed.scheme in {"data", "javascript", ""}:
            return None

        try:
            response = self.session.get(image_url, timeout=self.timeout)
            response.raise_for_status()

            source_name = Path(parsed.path).name
            ext = Path(source_name).suffix or self._guess_extension(response.headers.get("Content-Type"))
            if not source_name:
                source_name = f"img-{hashlib.md5(image_url.encode('utf-8')).hexdigest()[:10]}{ext}"

            filename = safe_filename(source_name, default_ext=ext)
            target = self.output_dir / filename

            if target.exists():
                unique = hashlib.md5(image_url.encode("utf-8")).hexdigest()[:8]
                filename = f"{target.stem}-{unique}{target.suffix}"
                target = self.output_dir / filename

            target.write_bytes(response.content)
            relative = f"images/{filename}"
            self.downloaded[image_url] = relative
            self.logger.info("Imagem baixada: %s", image_url)
            return relative
        except Exception as exc:  # noqa: BLE001
            self.errors.append({"url": image_url, "error": str(exc), "stage": "image_download"})
            self.logger.warning("Falha ao baixar imagem %s: %s", image_url, exc)
            return None

    def attach_local_paths(self, images: list[dict[str, Any]]) -> list[dict[str, Any]]:
        enriched = []
        for image in images:
            src = image.get("src_original", "")
            local_path = self.download_image(src) if src else None
            enriched.append({**image, "local_path": local_path})
        return enriched
