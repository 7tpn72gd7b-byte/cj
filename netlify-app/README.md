# Central CS — migração para Netlify (v57 candidata)

Esta pasta adapta a interface e as rotas existentes para Netlify Functions e Netlify Blobs privados. Não depende do login ChatGPT. O site atual do Sites não é alterado por esta pasta.

## Publicação

1. Autorizar na Netlify o repositório `7tpn72gd7b-byte/cj`.
2. Criar um projeto dedicado à Central CS; não reutilizar os projetos Vimo ou Violeiros.
3. Selecionar a branch de migração para validação. Base: `netlify-app`; comando: `npm run build`; publicação: `netlify-app/public` relativa à raiz do repositório (ou `public` quando o painel mostrar o caminho relativo à base); funções: `netlify-app/functions`. A configuração versionada é `netlify-app/netlify.toml`.
4. A aplicação fica bloqueada até a importação privada terminar. Prévias de deploy são bloqueadas e não acessam os dados de produção.
5. Configurar `TEAM_ADMIN_USERNAME=juliocnovais` no ambiente de execução, caso o nome do administrador seja diferente do padrão.

## Importação privada

O ZIP exportado contém dados privados: nunca colocá-lo nesta pasta, na publicação ou no GitHub.
Extraia-o fora do checkout. Em terminal confiável, execute `npm ci` nesta pasta. Defina `NETLIFY_SITE_ID` e `NETLIFY_AUTH_TOKEN` no ambiente do operador (não em arquivos versionados). Execute:

```
node import-backup.mjs /caminho/privado/Central_CS
```

O importador pede a nova senha do administrador sem exibi-la, preserva seu ID exportado, importa a base, scripts (inclusive arquivados), equipe e auditoria, e confere cada gravação. Recusa destinos que já tenham dados. Só libera o login após terminar. Falhas parciais deixam o destino bloqueado para revisão; não executar limpeza automática. Revogue o token de operador após finalizar.

A exportação de 19/11/2026 contém 47 clientes, 255 eventos, 24 scripts e 110 registros de auditoria. Conferir o pacote mais recente antes da migração definitiva: lançamentos posteriores não estão nesse ZIP.

Senhas anteriores e backups históricos não constam do ZIP. É necessário definir uma nova senha. Este importador exige a equipe de um único administrador presente nessa exportação; equipes maiores precisam de migração de identidades específica. As datas e IDs dos cadastros são preservados.

## Backups e conferência final

A função programada roda às 15h e 21h UTC (12h e 18h de Brasília). O agendamento usa a verificação idempotente existente. Confirmar a execução nos logs após o primeiro horário programado; falhas devem ser monitoradas no painel Netlify. Não desativar o backup atual do Sites durante a validação.

Antes da troca: comparar contagens e campos, testar login, equipe, scripts restritos e ordenação, filtros, PDFs, Kanban e edição de um registro de teste. Fazer um último backup do site atual e conciliar alterações posteriores ao ZIP. Depois da troca, toda a equipe deve usar o endereço novo para evitar bases divergentes.

## Verificação local

`npm run build` e `npm test`. A camada de armazenamento mantém condições de ETag para impedir perda de atualizações. O wrapper elimina cabeçalhos de identidade do Sites recebidos do visitante. Dados nunca ficam no diretório público. O limite de créditos da Netlify deve ser acompanhado pelo proprietário.
