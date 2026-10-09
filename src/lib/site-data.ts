import fs from 'node:fs';
import path from 'node:path';

export type PageJson = {
    url: string;
    title: string;
    meta_description: string;
    headings: { h1: string[]; h2: string[]; h3: string[] };
    breadcrumbs: string[];
    main_text: string;
    links: { internal: string[]; external: string[] };
    images: Array<{ alt: string; src_original: string; local_path: string | null }>;
    slug: string;
};

export type SitemapEntry = {
    url: string;
    slug: string;
    tipo: string;
    titulo: string;
    links_internos: number;
    links_externos: number;
    imagens: number;
};

export type SiteIndex = {
    base_url: string;
    total_paginas: number;
    paginas: SitemapEntry[];
};

const root = process.cwd();
const dataDir = path.join(root, 'src', 'data');
const pagesFile = path.join(dataDir, 'pages-data.json');
const indexFile = path.join(dataDir, 'site-index.json');

function readJson<T>(filePath: string): T {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

export function loadSiteIndex(): SiteIndex {
    return readJson<SiteIndex>(indexFile);
}

export function loadPagesMap(): Record<string, PageJson> {
    return readJson<Record<string, PageJson>>(pagesFile);
}

export function getRouteFromSlug(slug: string): string {
    return slug === 'home' ? '/' : `/${slug}/`;
}

function normalizeUrl(url: string): string {
    return url.replace(/\/$/, '').toLowerCase();
}

export function buildUrlToSlugMap(index: SiteIndex): Map<string, string> {
    const map = new Map<string, string>();
    for (const page of index.paginas) {
        map.set(normalizeUrl(page.url), page.slug);
    }
    return map;
}

export function internalUrlsToRoutes(urls: string[], urlToSlug: Map<string, string>): string[] {
    const routes: string[] = [];
    for (const url of urls) {
        const slug = urlToSlug.get(normalizeUrl(url));
        if (!slug) {
            continue;
        }
        routes.push(getRouteFromSlug(slug));
    }
    return Array.from(new Set(routes));
}

export function splitMainText(mainText: string): string[] {
    return String(mainText || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !/^seu navegador nao suporta/i.test(line))
        .filter((line) => !/^seu navegador não suporta/i.test(line));
}

export function cleanPageTitle(title: string): string {
    return String(title || '')
        .replace(/\s*-\s*SPA LUNAR Clinica Evelin Oliveira\s*$/i, '')
        .replace(/\s*-\s*SPA LUNAR\s*$/i, '')
        .trim();
}

export function slugToLabel(slug: string): string {
    if (slug === 'home') return 'Inicio';
    return slug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (m) => m.toUpperCase());
}

export function getPrimaryServices(index: SiteIndex): SitemapEntry[] {
    const roots = ['corrente-russa', 'criolipolise', 'detox-corporal', 'drenagens-linfaticas'];
    const selected = roots
        .map((slug) => index.paginas.find((item) => item.slug === slug))
        .filter(Boolean) as SitemapEntry[];

    if (selected.length) return selected;
    return index.paginas.filter((item) => item.slug !== 'home').slice(0, 4);
}
