# Verificação VIMO v3 — 12/11/2026

## Confirmado no navegador

- Abertura do simulador e filtros Fotos/Vídeos/Todos.
- Curtidas alteram contagem e alimentam Salvos.
- Comentários em publicação de exemplo e foto enviada.
- Seleção e publicação local de foto WebP e vídeo MP4.
- Dois vídeos no filtro após envio; metadados carregados, duração de 4 s, sem erro de mídia.
- Downloads de foto e vídeo disparados pelo navegador.
- Perfil com 2 publicações locais e 1 favorito após os testes.
- Galeria/favoritos abrem visualização de mídia.
- Card Formaturas abre personalização correta.
- Formulário vazio mostra erros; quantidade negativa de convidados é bloqueada.
- Menu móvel abre e fecha ao navegar. Prévia em viewport de 390×844; largura do conteúdo = largura do viewport.
- Pergunta frequente abre e Escape fecha visualização de mídia.

## Verificações de arquivos

- JavaScript validado com node --check.
- IDs sem duplicação e referências locais existentes.

## Limites

- O navegador remoto bloqueou a observação após a tentativa de abrir WhatsApp. O envio final de mensagens não foi executado e a abertura no aplicativo não foi confirmada.
- O compartilhamento usa a interface do aparelho ou a área de transferência; não foi enviada mensagem externa no teste.
- Simulador local: os registros de teste não são persistidos após recarregar e não há backend de eventos reais.
