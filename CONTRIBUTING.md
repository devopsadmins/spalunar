# Contribuicao

Este repositorio segue os padroes do projeto0.

## Fluxo de contribuicao

1. Criar branch por tema de mudanca.
2. Fazer alteracoes pequenas e rastreaveis.
3. Atualizar documentacao em docs/ quando a mudanca afetar arquitetura, operacao, API ou compliance.
4. Rodar validacoes locais antes do PR:
   - python3 -m py_compile main.py crawler.py extractor.py downloader.py utils.py
   - npm run build
5. Abrir PR com resumo tecnico e riscos.

## Regras obrigatorias

- Nao commitar segredos.
- Nao confiar em tenant_id vindo do cliente.
- Mudancas de contrato de API devem atualizar docs/api/.
- Excecoes de arquitetura, seguranca e deploy devem registrar ADR em docs/adr/.
