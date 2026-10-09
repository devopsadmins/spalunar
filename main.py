from __future__ import annotations

import argparse
from pathlib import Path

from crawler import CrawlConfig, SiteCrawler
from utils import setup_logging


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Backup estruturado de site para migracao (HTML + JSON + imagens + sitemap)."
    )
    parser.add_argument(
        "--start-url",
        default="https://www.hevelynestetica.com.br",
        help="URL inicial do crawl.",
    )
    parser.add_argument(
        "--output-dir",
        default="output",
        help="Diretorio de saida para artefatos.",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=1200,
        help="Limite maximo de paginas internas a visitar.",
    )
    parser.add_argument(
        "--use-playwright",
        action="store_true",
        help="Ativa fallback com Playwright para paginas dinamicas.",
    )
    parser.add_argument(
        "--user-agent",
        default="SiteMigrationBackupBot/1.0 (+manual-run)",
        help="User-Agent customizado para requisicoes.",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    setup_logging()

    config = CrawlConfig(
        start_url=args.start_url,
        output_dir=Path(args.output_dir),
        max_pages=args.max_pages,
        user_agent=args.user_agent,
        use_playwright_fallback=args.use_playwright,
    )

    crawler = SiteCrawler(config)
    crawler.crawl()


if __name__ == "__main__":
    main()
