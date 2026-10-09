# ADR 001 - Adocao do padrao projeto0 e front em Astro

## Status
Aprovado

## Contexto
O produto precisava reconstruir um site com base em backup estruturado (HTML bruto, JSON por pagina e imagens), mantendo rastreabilidade documental e padrao de engenharia do projeto0.

## Decisao
- Adotar estrutura documental obrigatoria do projeto0 em docs/.
- Implementar frontend estatico com Astro 4 para publicar o conteudo migrado.
- Manter crawler Python como etapa de ingestao e gerar dados de renderizacao via scripts/prepare-site.mjs.
- Preservar acentos e foco em conteudo migravel, nao em fidelidade visual.

## Consequencias
- Projeto passa a ter separacao clara entre ingestao (Python) e entrega web (Astro).
- Build do site depende da existencia de output/ atualizado do crawler.
- Novas decisoes de seguranca/API/infra devem continuar registradas em ADR.
