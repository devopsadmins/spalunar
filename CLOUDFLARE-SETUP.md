# CloudFlare Full (Strict) SSL - Guia Rápido

## Arquivos que foram ajustados

1. **Dockerfile**
   - Monta `/etc/nginx/certs/` com certificados Origin CA
   - Expõe portas 80 (HTTP) e 443 (HTTPS)

2. **docker/nginx.conf**
   - Servidor HTTPS na porta 443 com certificados Origin
   - Configuração SSL moderna (TLS 1.2/1.3)
   - Fallback HTTPS para validação quando Traefik não está disponível

3. **docker/swarm.yml**
   - Volume `./certs:/etc/nginx/certs:ro` montado no container
   - Comentários explicando configuração com Traefik
   - Labels do Traefik com suporte a TLS e cert resolver

4. **docs/RUNBOOKS.md**
   - Nova seção: "CloudFlare Full/Strict SSL Mode com Origin CA"
   - Procedimento passo a passo de setup
   - Troubleshooting para problemas comuns

5. **docs/adr/003-cloudflare-full-strict-origin-ca-spalunar-com-br.md**
   - Decisão arquitetural aprovada
   - Fluxo SSL documentado
   - Consequências e próximos passos

## Pré-requisitos

✓ Certificados `origin.cert` e `origin.key` gerados na CloudFlare (já presentes em `certs/`)
✓ CloudFlare configurado em modo "Full (Strict)"
✓ DNS apontando para IP do Traefik/spalunar
✓ Rede `traefik-public` existente no cluster Docker Swarm
✓ Variáveis de ambiente corretas em `docker/swarm.env`

## Deploy

```bash
# 1. Build da imagem (com certs inclusos agora)
docker build -t spalunar:latest .

# 2. Publicar no registry
docker push spalunar:latest

# 3. Carregar variáveis de deploy
set -a && source docker/swarm.env && set +a

# 4. Deploy da stack
docker stack deploy -c docker/swarm.yml spalunar
```

## Validação

```bash
# Healthcheck via HTTP
curl -s http://spalunar.com.br/healthz

# Healthcheck via HTTPS (usando Origin CA)
curl -I https://spalunar.com.br/

# Listar serviços
docker service ls | grep spalunar

# Inspecionar stack
docker service inspect spalunar_web
```

## Troubleshooting

Se o domínio ainda não está respondendo:

1. **DNS**: `dig spalunar.com.br @1.1.1.1` (valida resolução CloudFlare)
2. **Traefik**: `docker service ls` (verifica se Traefik está rodando)
3. **Certificados**: `ls -la certs/` (confirma arquivos presentes)
4. **Logs**: `docker service logs spalunar_web` (inspeciona erros)
5. **Firewall**: Validar que portas 80/443 estão abertas no servidor

Consulte [docs/RUNBOOKS.md](docs/RUNBOOKS.md) para mais detalhes.
