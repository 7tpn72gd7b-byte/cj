# Central CS

Código da Central de acompanhamento de clientes da Precisão Sistemas.

## Desenvolvimento

Requer Node.js 22 ou superior. Sem dependências externas.

```sh
node scripts/build.mjs
node scripts/validate-artifact.mjs
node tests/productivity.mjs
node tests/reliability.mjs
node tests/scheduled-backup.mjs
```

A aplicação usa Cloudflare Workers e armazenamento R2 (binding `BUCKET`). As variáveis `TEAM_ADMIN_USERNAME` e `BACKUP_OPERATOR_EMAIL` são configuradas no ambiente de hospedagem; não salve credenciais neste repositório.

Os dados de clientes, contas e backups ficam no armazenamento do servidor e não fazem parte deste repositório. Este repositório é uma cópia do código; o envio ao GitHub não configura publicação automática nem transfere a hospedagem existente.
