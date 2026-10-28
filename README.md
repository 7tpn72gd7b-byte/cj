# Central CS

Código da Central de acompanhamento de clientes da Precisão Sistemas.

Requer Node.js 22 ou superior, sem dependências externas.

```sh
node scripts/build.mjs
node scripts/validate-artifact.mjs
node tests/productivity.mjs
node tests/reliability.mjs
node tests/scheduled-backup.mjs
```

Hospedagem atual: Sites / Cloudflare Workers, R2 com binding `BUCKET`. Variáveis de ambiente: `TEAM_ADMIN_USERNAME` e `BACKUP_OPERATOR_EMAIL`. Configure valores no servidor, nunca no repositório.

Este repositório contém somente código e logo. Clientes, contas, senhas e backups permanecem no armazenamento do servidor. O envio ao GitHub não transfere a hospedagem nem configura publicação automática. A identidade da hospedagem existente está em `.openai/hosting.json`.
