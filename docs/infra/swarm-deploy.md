# Deploy Swarm - Site spalunar.com.br

Este documento descreve o deploy do frontend estatico em Docker Swarm com Traefik.

## Premissas

- Rede overlay externa existente: traefik-public
- Traefik com entrypoints web/websecure ativo no cluster
- Certificados TLS ja provisionados no Traefik (default certificate)

## Arquivos

- Dockerfile
- docker/nginx.conf
- docker/swarm.yml
- docker/swarm.env.example

## Fluxo de publicacao

1. Gerar artefato do site:
   - npm run build
2. Construir imagem:
   - docker build -t <imagem:tag> .
3. Publicar imagem no registry.
4. Preparar env de deploy (nao versionado) a partir de docker/swarm.env.example.
5. Deploy da stack:
   - set -a && source docker/swarm.env && set +a
   - docker stack deploy -c docker/swarm.yml ${STACK_NAME}

## Validacao

- docker service ls | grep ${STACK_NAME}
- curl -I https://spalunar.com.br
- curl -s https://spalunar.com.br/healthz

## Rollback

- docker service rollback ${STACK_NAME}_web

## Observacoes

- O Traefik roteia tanto o dominio raiz quanto www.
- Ajustes de DNS devem apontar para o endpoint do Traefik.
- Em caso de troca de certificado, atualizar os arquivos de certificado no Traefik.
