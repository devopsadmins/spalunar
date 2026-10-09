import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const outputDir = path.join(root, 'output');
const outputImages = path.join(outputDir, 'images');
const outputJson = path.join(outputDir, 'json');
const sitemapFile = path.join(outputDir, 'sitemap.json');

const publicImages = path.join(root, 'public', 'images');
const dataDir = path.join(root, 'src', 'data');
const pagesDataFile = path.join(dataDir, 'pages-data.json');
const siteIndexFile = path.join(dataDir, 'site-index.json');

function ensureDir(dirPath) {
    fs.mkdirSync(dirPath, { recursive: true });
}

function copyImages() {
    ensureDir(publicImages);
    if (!fs.existsSync(outputImages)) {
        console.warn('[prepare-site] Pasta de imagens nao encontrada em output/images.');
        return 0;
    }

    const files = fs.readdirSync(outputImages);
    for (const file of files) {
        const source = path.join(outputImages, file);
        const target = path.join(publicImages, file);
        fs.copyFileSync(source, target);
    }
    return files.length;
}

function classifyBySlug(slug) {
    if (slug === 'home') return 'home';
    if (slug.startsWith('corrente-russa')) return 'corrente-russa';
    if (slug.startsWith('criolipolise') || slug.includes('congelar-gordura')) return 'criolipolise';
    if (slug.startsWith('detox-corporal') || slug.startsWith('detox-com-argila')) return 'detox-corporal';
    if (slug.startsWith('drenagens-linfaticas') || slug.startsWith('drenagem-linfatica') || slug.startsWith('massagem-drenagem')) {
        return 'drenagens-linfaticas';
    }
    return 'institucional';
}

function cleanMainText(value) {
    const noisyStarts = [
        'Seu navegador nao suporta',
        'Seu navegador não suporta',
    ];
    const stopSectionPatterns = [
        /^paginas relacionadas$/i,
        /^páginas relacionadas$/i,
        /^regioes onde/i,
        /^regiões onde/i,
        /^encontrou o que procurava\?$/i,
        /^faca seu orcamento/i,
        /^faça seu orçamento/i,
        /^quero meu orcamento$/i,
        /^quero meu orçamento$/i,
    ];

    const lines = String(value || '')
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !noisyStarts.some((prefix) => line.startsWith(prefix)));

    const kept = [];
    for (const line of lines) {
        if (stopSectionPatterns.some((rx) => rx.test(line))) {
            break;
        }
        kept.push(line);
    }

    const dedup = [];
    for (const line of kept) {
        if (dedup[dedup.length - 1] === line) continue;
        dedup.push(line);
    }
    return dedup.join('\n');
}

function pageLooksRenderable(entry, pageJson) {
    if (!entry || !pageJson) return false;
    if (entry.slug.startsWith('imagens-')) return false;
    if (entry.slug.length > 90) return false;
    if (!pageJson.title) return false;
    const tokenCount = entry.slug.split('-').filter(Boolean).length;
    if (tokenCount > 9) return false;
    if (!pageJson.main_text && !pageJson.headings?.h1?.length) return false;
    return true;
}

function buildDataFiles() {
    if (!fs.existsSync(sitemapFile)) {
        throw new Error('Arquivo output/sitemap.json nao encontrado. Rode o crawler antes.');
    }

    ensureDir(dataDir);

    const rawIndex = JSON.parse(fs.readFileSync(sitemapFile, 'utf-8'));
    const pagesMap = {};
    const filteredPages = [];

    for (const entry of rawIndex.paginas || []) {
        const jsonPath = path.join(outputJson, `${entry.slug}.json`);
        if (!fs.existsSync(jsonPath)) {
            continue;
        }

        const pageJson = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
        if (!pageLooksRenderable(entry, pageJson)) {
            continue;
        }

        pageJson.main_text = cleanMainText(pageJson.main_text);
        entry.tipo = classifyBySlug(entry.slug);

        pagesMap[entry.slug] = pageJson;
        filteredPages.push(entry);
    }

    const siteIndex = {
        ...rawIndex,
        total_paginas: filteredPages.length,
        paginas: filteredPages,
    };

    fs.writeFileSync(pagesDataFile, JSON.stringify(pagesMap, null, 2), 'utf-8');
    fs.writeFileSync(siteIndexFile, JSON.stringify(siteIndex, null, 2), 'utf-8');

    return {
        pages: filteredPages.length,
    };
}

function run() {
    const copiedImages = copyImages();
    const { pages } = buildDataFiles();
    console.log(`[prepare-site] Paginas renderizaveis: ${pages}`);
    console.log(`[prepare-site] Imagens copiadas para public/images: ${copiedImages}`);
}

run();
