# Runbooks

## Publicacao do site migrado

1. Atualizar conteudo com crawler Python (python main.py).
2. Preparar dados de renderizacao (npm run prepare:site).
3. Gerar build estatico (npm run build).
4. Publicar pasta dist/ no servidor web.

## Publicacao via Docker Swarm

1. Gerar artefato:
	- npm run build
2. Build da imagem do site:
	- docker build -t <imagem:tag> .
3. Publicar imagem no registry.
4. Carregar variaveis de deploy:
	- set -a && source docker/swarm.env && set +a
5. Deploy da stack:
	- docker stack deploy -c docker/swarm.yml ${STACK_NAME}

## Verificacao pos-deploy

- curl -I https://spalunar.com.br
- curl -s https://spalunar.com.br/healthz
- docker service ps ${STACK_NAME}_web

## Blog backend

- Health API: curl -s https://spalunar.com.br/healthz
- Listagem publica: curl -s https://spalunar.com.br/api/blog/posts
- Rotas admin exigem header X-Admin-Token com BLOG_ADMIN_TOKEN.

## Rollback

- docker service rollback ${STACK_NAME}_web

## Falha no build

- Verificar se output/sitemap.json existe.
- Verificar se output/json contem paginas.
- Rodar npm run prepare:site manualmente para diagnostico.

## Falha de roteamento no Traefik

- Confirmar existencia da rede externa traefik-public no cluster.
- Confirmar se DOMAIN esta correto no env de deploy.
- Confirmar se os certificados TLS padrao do Traefik estao montados e validos.
- Validar labels do servico com docker service inspect ${STACK_NAME}_web.

## CloudFlare Full/Strict SSL Mode com Origin CA

### Contexto

CloudFlare oferece tres modos de SSL:
- **Flexible**: CloudFlare↔browser=HTTPS, CloudFlare↔origin=HTTP (nao recomendado)
- **Full**: CloudFlare↔origin=HTTPS com certificado valido (Let's Encrypt, self-signed, etc)
- **Full (Strict)**: CloudFlare↔origin=HTTPS com certificado valido emitido por CA conhecida ou Origin CA

### Setup com certificados Origin CA da CloudFlare

1. **Gerar certificados na CloudFlare**:
   - Acesso SSL/TLS → Origin Server → Create certificate
   - Salvar tanto arquivo .cert quanto .key

2. **Colocar certificados no repositorio**:
   - Criar/atualizar pasta `certs/` na raiz do spalunar
   - Adicionar `origin.cert` e `origin.key` (nao versionar arquivos privados em producao)
   - Atualizar `.gitignore` se necessario para permitir versionamento de exemplo

3. **Atualizacoes no codigo**:
   - `Dockerfile`: Monta `/etc/nginx/certs/` com certificados (ja configurado)
   - `docker/nginx.conf`: Servidor HTTPS na porta 443 usando certificados (ja configurado)
   - `docker/swarm.yml`: Volume com certificados montado na stack (ja configurado)

4. **Configuracao do Traefik**:
   - Traefik precisa usar certificados Origin CA para servir HTTPS ao CloudFlare
   - Duas opcoes:
     a) Configurar file provider no traefik.yml central (recomendado para producao)
     b) Usar Let's Encrypt com validacao ACME via DNS (ativo atualmente)
   - Validar que Traefik escuta nas portas 80/443 e esta acessivel externamente

5. **Validacao**:
   - `curl -I https://spalunar.com.br/`: Deve retornar 200 com certificado valido
   - `curl -s https://spalunar.com.br/healthz`: Deve retornar "ok"
   - CloudFlare Dashboard → SSL/TLS → Overview: Deve mostrar "Full (Strict)"

### Troubleshooting

**Dominio nao esta respondendo:**
- Confirmar que DNS na CloudFlare aponta para IP correto do Traefik
- `dig spalunar.com.br @1.1.1.1`: Verificar resolucao
- `curl -I https://spalunar.com.br`: Testar acesso direto ao origin

**Certificado invalido no CloudFlare:**
- Verificar que origem.cert e origin.key sao validos
- `openssl x509 -in certs/origin.cert -text -noout | grep -A2 "Not Before"`
- Traefik/Nginx precisam ter acesso aos arquivos em `/etc/nginx/certs/`

**Let's Encrypt nao esta emitindo:**
- Confirmação ACME pode estar falhando
- Validar que DOMAIN está correto e resolvivel
- Se usando Origin CA, certificados Let's Encrypt nao sao necessarios
