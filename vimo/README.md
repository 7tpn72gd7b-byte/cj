# VIMO — apresentação oficial

Site estático em português, com simulador local, exemplos de temas e contato pelo WhatsApp.

## Executar

Na pasta do projeto: `python3 -m http.server 8080`. Abra http://localhost:8080.

## Publicar no Netlify

Importe este repositório, selecione a pasta deste projeto como diretório-base e `.` como diretório de publicação. Não é necessário comando de build. Para publicação manual, envie o conteúdo do ZIP, com index.html na raiz.

O vínculo automático ao endereço vimooficial.netlify.app precisa ser configurado na conta Netlify responsável. Salvar no GitHub, por si só, não atualiza esse endereço.

## Conteúdo comercial

Valores, prazos, limites e condições de eventos reais devem ser confirmados pelo responsável antes de publicar como oferta. Nenhum depoimento ou indicador real foi inventado. Os exemplos de temas são ilustrativos.

## Privacidade

O simulador usa arquivos locais via Object URLs, sem upload. O formulário abre uma mensagem no WhatsApp para revisão. Leia privacidade.html e termos.html e revise as condições para produção.

## Configuração do atendimento

O contato está configurado em `assets/config.js`. O proprietário autorizou explicitamente a publicação do número de WhatsApp neste repositório público em 12/11/2026. Para alterar, edite `whatsapp` com DDI e DDD.

## Organização

Projeto independente em `vimo/` dentro do repositório compartilhado. Os arquivos da Central CS não são alterados. No Netlify, use diretório-base `vimo` e publicação `.`. A conexão entre a hospedagem existente e esta pasta precisa ser feita na conta responsável pela Netlify.
