# SPA LUNAR - Migracao de Conteudo e Novo Site

Repositorio do produto com dois pilares:

- pipeline de backup/migracao em Python (crawler + extracao estruturada)
- novo site estatico em Astro, gerado a partir do conteudo extraido

O projeto segue o padrao documental do projeto0 (AGENTS, ADR, docs de operacao, privacidade, SLO, SBOM e afins).

## Estrutura principal

```text
.
├── AGENTS.md
├── CONTRIBUTING.md
├── crawler.py
├── extractor.py
├── downloader.py
├── main.py
├── requirements.txt
├── package.json
├── astro.config.mjs
├── scripts/
│   └── prepare-site.mjs
├── src/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
├── public/
├── output/
│   ├── html/
│   ├── json/
│   ├── images/
│   ├── pages_index.csv
│   ├── sitemap.json
│   └── summary.json
└── docs/
    ├── adr/
    ├── api/
    ├── privacy/
    ├── post-mortems/
    ├── slo/
    ├── sbom/
    ├── infra/
    ├── skills/
    └── templates/
```

## 1) Gerar conteudo migrado (Python)

Requisitos:

- Python 3.12+

Instalacao:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Opcional para fallback dinamico:

```bash
playwright install chromium
```

Execucao:

```bash
python main.py --use-playwright
```

Saidas em output/:

- html/<slug>.html
- json/<slug>.json
- images/
- sitemap.json
- pages_index.csv
- summary.json

## 2) Subir o novo site (Astro)

Requisitos:

- Node 22+

Instalacao:

```bash
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build de producao:

```bash
npm run build
```

Como funciona:

- scripts/prepare-site.mjs copia output/images para public/images
- scripts/prepare-site.mjs gera src/data/pages-data.json e src/data/site-index.json
- o Astro renderiza home, mapa e paginas internas com base nesses dados

## Padrão projeto0 adotado

- Contrato de agentes na raiz: AGENTS.md
- ADR inicial em docs/adr/001-adocao-padrao-projeto0-e-site-astro.md
- Estrutura documental obrigatoria criada em docs/
- Fluxo de contribuicao em CONTRIBUTING.md

## 3) Deploy em Docker Swarm (spalunar.com.br)

Arquivos de deploy:

- Dockerfile
- docker/nginx.conf
- docker/swarm.yml
- docker/swarm.env.example

Passos:

1. Gerar build estatico:
    - npm run build
2. Build da imagem:
    - docker build -t <imagem:tag> .
3. Publicar imagem no registry.
4. Criar arquivo de ambiente local de deploy (ex.: docker/swarm.env) baseado em docker/swarm.env.example.
5. Fazer deploy no Swarm:
    - set -a && source docker/swarm.env && set +a
    - docker stack deploy -c docker/swarm.yml ${STACK_NAME}

Roteamento:

- Dominio principal: spalunar.com.br
- Alias: www.spalunar.com.br
- TLS via certificados ja provisionados no Traefik (sem certresolver neste stack).

## Blog + Backend

O projeto agora possui backend para blog em FastAPI.

Arquivos:

- backend/main.py
- backend/requirements.txt
- Dockerfile.backend

API principal:

- GET /healthz
- GET /api/blog/posts
- GET /api/blog/posts/{slug}
- GET /api/blog/admin/posts (token)
- POST /api/blog/admin/posts (token)
- PUT /api/blog/admin/posts/{id} (token)
- DELETE /api/blog/admin/posts/{id} (token)

Token admin:

- Header: X-Admin-Token
- Variavel de ambiente: BLOG_ADMIN_TOKEN

Frontend do blog:

- /blog/
- /blog/post/?slug=<slug>
