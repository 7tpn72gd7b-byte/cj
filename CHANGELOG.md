# Notas de versão — Central CS

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
