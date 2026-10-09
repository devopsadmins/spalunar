# AGENTS.md - contrato agnostico para agentes no spalunar

Este repositorio foi estruturado para ser lido por agentes de IA e por pessoas. A fonte normativa canonica esta no projeto0 e nos artefatos versionados sob docs/.

## Fonte de verdade

- Norma global: ../projeto0/padroes_engenharia_v2.6.md
- Glossario: ../projeto0/glossario.md
- Adocao em produtos: ../projeto0/docs/GUIA-NOVO-PROJETO.md
- Estrutura obrigatoria: ../projeto0/docs/ESTRUTURA-DOCUMENTACAO-OBRIGATORIA.md
- Regras de agentes e skills: ../projeto0/docs/CURSOR-E-SKILLS.md

## Regras de atuacao

- Nao substituir regras versionadas por instrucoes soltas em prompt.
- Se uma decisao afetar seguranca, LGPD, isolamento de tenant, contrato de API, deploy ou operacao, registrar em ADR do produto.
- Infra, correcoes de incidentes e excecoes arquiteturais devem ser documentadas no produto.
- Segredos nunca em codigo, docs ou exemplos com valores reais.

## Coordenacao multiagente

- Preferir um agente por slice de mudanca ou grupo explicito de arquivos.
- Resolver conflito de contrato no artefato canonico: ADR, OpenAPI, docs/privacy, docs/RUNBOOKS.md ou norma global.
- Validar cada slice localmente antes de integrar.
- Evitar edicoes paralelas no mesmo arquivo quando houver divisao por documento.

## Compatibilidade

Formato agnostico para Cursor, Copilot, Claude Code, OpenClaw e orquestradores equivalentes.
