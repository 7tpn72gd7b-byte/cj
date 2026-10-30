# Notas de versão — Central CS

## Versão 48.2 — 30/10/2026

- Buscar cliente, Atualizar página e Novo cliente posicionados antes do sino de notificações e do perfil, na mesma linha do cabeçalho em telas maiores.
- Em telas pequenas, os controles se ajustam para manter textos e ações acessíveis.

## Versão 48.1 — 30/10/2026

- Corrigido o dimensionamento dos filtros do Health Score para evitar corte das opções, em especial a fila de contatos. Controles distribuídos em colunas responsivas, sem ocupar uma largura excessiva.
- Pequenas correções passam a usar sufixo decimal sobre a versão de produto publicada. Esta correção parte da versão 48; funcionalidades novas continuam a incrementar a versão principal.
- Dados, cálculos e regras de importação preservados.

## Versão 48 — 30/10/2026

- Filtros de revenda, cidade e UF no Health Score, com limpeza rápida e fila para nunca contatados, maior tempo sem contato e retornos vencidos/hoje.
- Evolução na ficha compara avaliações com mesmos critérios, modelo e cobertura suficiente; contatos sem resposta não geram melhora ou piora artificial.
- Resumo do follow-up copiável para colar no ticket do Zendesk, incluindo respostas, justificativa e ação opcional. Não envia mensagens nem altera tickets.
- Relatório mensal por revenda com entradas, churns, retornos e clientes de cada grupo, além de distribuição de saúde e exportação CSV. Saúde usa carteira ativa atual com avaliações até o fim do mês; movimentações usam o histórico registrado. Cadastros manuais novos passam a registrar a data de entrada, sem inventar datas para os antigos.
- Recuperação de acesso e autenticação em duas etapas excluídas desta versão a pedido do usuário; acessos atuais preservados.
- Versão 47 preservada.

## Versão 47 — 30/10/2026

- Health Score com cores distintas: verde para saudável, amarelo para atenção, laranja para risco elevado, vermelho para prioridade crítica, azul para avaliação parcial e cinza para sem avaliação.
- Etiquetas com nome do nível e faixas laterais discretas na lista de clientes, além de legenda das cores. Mesma paleta no cadastro, no histórico e na prévia do questionário.
- Churn identificado em cinza escuro, separado da avaliação de saúde.
- Perfil no canto superior direito com avatar e acesso a Minha conta e Sair. Sino com contador de pendências reais: follow-ups, retornos e alertas críticos do Health Score, com acesso à ficha.
- Pontuações, critérios e cadastros preservados. Versão 46 mantida no histórico.

## Versão 46 — 30/10/2026

- Importação Health Score com modos de adição parcial e sincronização da lista completa de uma revenda, comparando CNPJs.
- Clientes novos são adicionados; existentes mantêm cadastro e avaliações; contratos importados ausentes da lista completa são classificados como churn e saem dos ativos, preservando histórico. Reaparições na lista completa reativam o contrato.
- Conferência por nome e CNPJ antes de confirmar; resultados e histórico persistente em Entradas e churn, incluindo novos, mantidos, churns e retornos.
- Filtros de ativos, churn e todos os contratos. Cadastros manuais e outras revendas não sofrem churn por ausência na planilha.
- Sincronização completa exige confirmação e bloqueia arquivos vazios, linhas inválidas, duplicadas ou conflitos entre revendas. Carteira de implantação preservada.
- Versão 45 preservada.

## Versão 45 — 30/10/2026

- Importação de clientes por Excel (.xlsx/.xls) e CSV exclusivamente no Health Score, com modelo Excel, escolha da aba, correspondência de colunas e conferência antes de adicionar.
- Revenda, cidade e estado (UF) solicitados no cadastro Health Score e na importação; informações exibidas na lista e na ficha.
- CNPJs repetidos e linhas inválidas são sinalizados e ignorados, sem substituir clientes nem avaliações existentes.
- Importação não cria avaliações e não altera a carteira de implantação. Arquivo lido no navegador com biblioteca local, sem envio da planilha a serviços externos.
- Versão 44 preservada.

## Versão 44 — 30/10/2026

- Nova aba Health Score com carteira própria inicialmente vazia, sem importar ou criar clientes e avaliações automaticamente. Clientes da implantação preservados.
- Questionário embutido no cadastro e em novos follow-ups: satisfação (25%), suporte (20%), valor (20%), autonomia (15%), relacionamento (10%) e continuidade (10%).
- Pontuação positiva/intermediária/negativa; não avaliado excluído da média. Cobertura abaixo de 60% identificada como parcial; sem resposta não gera nota.
- Histórico de contatos, justificativa, canal, treinamento, pendências, ação opcional e retorno. Alertas de operação impedida ou intenção de cancelamento destacados separadamente da nota.
- Indicador operacional permanece sem cálculo, sem inferir uso real do ERP. Modelo inicial de relacionamento baseado na conversa compartilhada, sem alegação de previsão de churn.
- Dados persistidos na base compartilhada e incluídos nas cópias existentes; validação de cadastros e avaliações no servidor. Versão 43 preservada.

## Versão 43 — 30/10/2026

- Aviso de CNPJ já cadastrado durante o preenchimento, mostrando cliente e etapa, com botão para abrir a ficha existente. Reconhece CNPJ com ou sem pontuação e permite editar o próprio cliente.
- Bloqueio de duplicação ao salvar mantido no navegador e no servidor. Nenhum cadastro foi mesclado ou removido.
- Agendamento existente reafirmado para todos os dias às 12h e 18h, horário de Brasília. Cópia de verificação de 30/10 persistida e confirmada.
- Consulta das cópias programadas agora verifica o arquivo armazenado e as quantidades de registros, ordenando pela data real de gravação.
- Teste de restauração realizado somente em base isolada, sem restaurar ou alterar a base de produção. Versão 42 preservada.

## Versão 42 — 29/10/2026

- Quatro indicadores do Meu dia mais compactos, com altura mínima de 120 px e alinhamento consistente.
- Detalhes e link de conferência do tempo médio aproximados, preservando todas as informações e o cálculo.
- Duas colunas em telas menores, com uma coluna apenas em telas muito estreitas.
- Alteração somente visual; versão 41 preservada.

## Versão 41 — 29/10/2026

- Conferência do tempo médio com clientes considerados e excluídos, datas e prazos individuais.
- Relatório de ativações com espera para iniciar, duração da implantação e prazo total, incluindo médias, CSV e impressão/PDF. Cada média informa sua própria quantidade de clientes válidos.
- Revisão recolhida de cadastros sem data de chegada, início de implantação aplicável ou vendedor.
- Minha conta permite editar nome de exibição e trocar senha, mediante senha atual. O login e os vínculos de responsável são preservados; a troca de senha invalida outras sessões e renova a atual.
- Verificação dos backups: agendamento encontrado pausado; cópia programada confirmada para a ocorrência de 28/10 às 12h, gravada às 13h54 de Brasília. Nenhuma execução posterior foi confirmada. O agendamento não foi reativado nesta alteração.
- Não foi criada aba de novidades. Versão 40 preservada.

## Versão 40 — 29/10/2026

- Removido o campo separado de ticket de implantação do formulário e da ficha do cliente.
- O acompanhamento da implantação e os follow-ups passam a usar o ticket inicial, informado na entrada.
- Valores antigos de ticket de implantação e seus históricos permanecem preservados, sem alteração em massa nos cadastros.
- Ticket de ativação de carteira mantido, conforme fluxo já existente.
- Versão 39 preservada no histórico.

## Versão 39 — 29/10/2026

- Adicionado o indicador “Tempo médio até a ativação” no topo de Meu dia.
- Cálculo automático em dias corridos entre chegada e ativação, considerando todos os clientes já ativados da base inteira.
- Exibida a quantidade de clientes com datas válidas usada na média e a quantidade excluída por ausência ou inconsistência de datas.
- Comparação com a média geral acumulada até o fim do mês anterior.
- Sem dados suficientes, o indicador informa a ausência de dados ou de comparação.
- Cálculo atualizado ao renderizar o painel, inclusive após carregar alterações da equipe. Nenhum cadastro é alterado pelo indicador.
- Versão 38 preservada no histórico de publicação e no GitHub.

## Versão 38 — 28/10/2026

- Estado anterior de referência: robozinho com headset e ciclo animado de corrida durante o carregamento.
- Inclui o visual compacto da carteira, o painel Meu dia em três colunas e os relatórios por vendedor.
