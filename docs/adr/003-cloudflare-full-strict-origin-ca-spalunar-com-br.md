# ADR 003 - CloudFlare Full (Strict) SSL com Origin CA para spalunar.com.br

## Status
Aprovado

## Contexto

Ao publicar spalunar.com.br, a CloudFlare estava configurada em modo "Flexible" ou "Full" padrão. Para aumentar segurança de borda e garantir que o certificado do origin seja validado, foi necessário:

1. Ativar modo Full (Strict) na CloudFlare
2. Usar certificados Origin CA emitidos pela CloudFlare para validacao cliente-servidor entre CloudFlare e origin (Traefik)
3. Garantir que nginx/Traefik conseguissem servir HTTPS com certificados válidos

## Decisao

- **SSL na CloudFlare**: Modo Full (Strict) obrigatorio
- **Certificados**: Origin CA emitidos pela CloudFlare (private key nao versionado em repositorios compartilhados)
- **Organizacao**: Pasta `certs/` na raiz do spalunar com `origin.cert` e `origin.key`
- **Nginx**: Servidor HTTPS na porta 443 com certificados Origin como fallback e validacao
- **Traefik**: Continua gerenciando SSL via cert resolver (Let's Encrypt ou futuro file provider com Origin CA)
- **Documentacao**: Procedimento adicionado em RUNBOOKS.md e atualizado docker/swarm.yml

## Decisoes Arquiteturais

### Fluxo SSL

```
    user (browser)
         ↓ HTTPS (cert público CloudFlare)
    CloudFlare [Full (Strict) mode]
         ↓ HTTPS (cert Origin CA validado)
    Traefik [load balancer/router]
         ↓ HTTP (interno, sem SSL necessario)
    Nginx [porta 80 interno + porta 443 para validacao]
```

### Por que certificados Origin CA?

- CloudFlare Full (Strict) exige certificado válido do origin (não aceita self-signed)
- Let's Encrypt funciona, mas demanda validação ACME
- Origin CA da CloudFlare permite validar origem sem exposição de certificados privados na borda
- Simplifica troubleshooting quando SSL falha: certificado já está validado internamente

### Por que nginx com HTTPS?

1. **Validacao**: nginx pode servir porta 443 com certificados Origin para testes
2. **Fallback**: Se Traefik falhar, nginx continua respondendo HTTPS
3. **SLA**: Redundancia em caso de falha de roteador

## Consequencias

### Positivas
- Segurança aumentada: origin é validado pela CloudFlare
- Isolamento de tenant: certificados privados não circulam
- Debugging facilitado: healthcheck pode testar tanto HTTP (80) quanto HTTPS (443)

### Negativas
- Renovacao de certificados: Origin CA tem prazo (geralmente 15 anos), mas precisa ser monitorado
- Gerenciamento de secrets: private key deve estar em vault/segredo em producao, nao versionado
- Complexidade: dois servidores (Traefik + nginx) precisam estar sincronizados

## Implementacao

### Arquivos modificados

1. **Dockerfile**: Monta `/etc/nginx/certs/` e expõe porta 443
2. **docker/nginx.conf**: Servidor HTTPS com certificados Origin
3. **docker/swarm.yml**: Volume com certs montado no servico spalunar_web
4. **docs/RUNBOOKS.md**: Procedimento de setup e troubleshooting

### Proximos passos (future)

- Configurar file provider no Traefik central para servir Origin CA (hoje usa Let's Encrypt)
- Rotina automatizada de renovacao de Origin CA na CloudFlare
- Monitoramento de expiracao de certificado em healthcheck ou SLO

## Validacao

- `curl -I https://spalunar.com.br`: Retorna 200 com certificado valido
- CloudFlare Dashboard: SSL/TLS status mostra "Full (Strict)"
- `openssl s_client -connect spalunar.com.br:443`: Certificado validavel

## Referências

- [CloudFlare SSL/TLS modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [CloudFlare Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/)
- ADR 002 - Deploy em Docker Swarm com Traefik e Nginx
