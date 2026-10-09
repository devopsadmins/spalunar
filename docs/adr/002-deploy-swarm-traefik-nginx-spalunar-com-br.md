# ADR 002 - Deploy em Docker Swarm com Traefik e Nginx para spalunar.com.br

## Status
Aprovado

## Contexto
O produto precisava publicar o novo site estatico com dominio proprio (spalunar.com.br), seguindo o baseline do projeto0 para borda com Traefik e publicacao web por Nginx.

## Decisao
- Empacotar o artefato estatico (dist/) em imagem Nginx.
- Publicar no Docker Swarm via stack dedicada.
- Expor via Traefik em HTTPS para spalunar.com.br e www.spalunar.com.br.
- Definir healthcheck HTTP em /healthz para suporte operacional e rollout.

## Consequencias
- O deploy passa a depender de build previo do frontend (dist/) antes do build da imagem.
- Roteamento e TLS ficam centralizados no Traefik da rede traefik-public.
- Alteracoes futuras de dominio, certificados TLS ou estrategia de rollout devem atualizar docker/swarm.yml e runbooks.
