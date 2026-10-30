# Central CS — versionamento solicitado pelo usuário

- Antes de alterar o site, consulte a publicação atual no Sites e abra a fonte pelo workflow suportado. Use o arquivo VERSION correspondente à versão publicada como referência do produto.
- Correções pequenas incrementam o sufixo decimal da versão principal: 48 -> 48.1 -> 48.2. Funcionalidades novas incrementam a versão principal: 48.2 -> 49.
- O contador sequencial de versões do provedor Sites é uma revisão técnica; ele pode divergir da versão de produto em VERSION. Não o use sozinho para informar a versão ao usuário ou escolher a próxima versão.
- Atualize VERSION e CHANGELOG.md em toda publicação. Preserve as versões anteriores e sincronize a alteração com o GitHub conectado 7tpn72gd7b-byte/cj.
- Nunca publique os dados de clientes, senhas, chaves ou backups no repositório GitHub público.
