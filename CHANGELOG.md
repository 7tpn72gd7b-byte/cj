## Versão 53.1 — 11/11/2026

- Relatórios em PDF e impressão com página A4 em paisagem, margens de 12 mm e uso de toda a largura disponível.
- Tabelas com quebra de texto, cabeçalhos repetidos e proteção contra corte de linhas entre páginas.

## Versão 53 — 10/11/2026

- Pós-ativação com retornos de 7, 30 e 60 dias, vinculados à data da ativação. Inclusão opcional para carteiras já ativadas.
- Planos de ação e encaminhamentos com responsável, prazo, ticket quando aplicável e histórico de conclusão ou cancelamento.
- Pendências aparecem no Meu dia, com atalho para abrir e tratar a ação.
- Relatório de gargalos com prazo mínimo, média por etapa e acesso às fichas. Registros sem data válida ficam fora dos cálculos.

## Versão 52.3 — 10/11/2026

- Ficha com resumo da etapa, responsável, último contato e próximo passo, ação principal contextual e linha do tempo destacando a etapa atual.
- Histórico de contatos separado das demais movimentações; cadastro, retornos e treinamentos organizados em seções.
- Clientes, Health Score e Relatórios com totais e filtros ativos visíveis; busca nas entradas e limpeza de filtros.
- Confirmação de salvamento consistente no painel e na ficha, distinguindo salvamento em curso, alterações pendentes e confirmação do servidor.

## Versão 52.2 — 10/11/2026

- Atualizações rápidas mostram atividade no botão; o robô aparece só quando a espera é perceptível.
- O robô pega o ticket apenas após a confirmação dos dados. Em esperas longas, a mensagem indica sincronização; em falhas, é possível tentar novamente.
- O painel se atualiza sem recarregar a tela inteira e respeita a preferência por movimento reduzido.

## Versão 52.1 — 06/11/2026

- Organização dos scripts por arrastar e soltar, substituindo os botões de subir e descer.
- Alça de arraste com destaque visual, suporte a mouse e toque, rolagem ao alcançar as bordas e alternativa pelas setas do teclado.
- Sequência continua salva por categoria no servidor, preservando textos e permissões.

## Versão 52 — 06/11/2026

- Organização manual dos scripts por categoria, com setas para subir e descer e salvamento da sequência no servidor.
- Ordem preservada nos próximos acessos e na busca, sem alterar os textos; alterações simultâneas protegidas por controle de versão.
- Acesso e organização exclusivos do administrador, com histórico privado antes de cada alteração.

## Versão 51.1 — 06/11/2026

- Complemento dos textos nas cinco categorias com o arquivo completo de onboarding enviado pelo administrador.
- Mensagens ao cliente e orientações para tickets separadas por situação, preservando os textos originais e sinalizando datas, valores e vencimentos que precisam de revisão.
- Importação idempotente de novos modelos, preservando scripts criados ou editados pelo administrador e itens da lixeira.
- Os dois modelos preliminares, quando ainda não editados, passam à lixeira para evitar confusão com o material completo; continuam recuperáveis.
- Conteúdo mantido em configuração privada do servidor, fora do código público e do GitHub.

## Versão 51 — 06/11/2026

- Nova aba Scripts de atendimento exclusiva do administrador, com cinco categorias: Onboarding, Cliente já existente, Follow-up onboarding, Ativação de carteira e Módulo adicional.
- Busca por título e conteúdo dentro da categoria, visualização, cópia, criação e edição de mensagens.
- Exclusão reversível na lixeira, restauração e versões privadas antes de cada alteração.
- Autorização de administrador validada no servidor, proteção contra alterações simultâneas e armazenamento separado da base de clientes.
- Textos iniciais do arquivo enviados para configuração privada do servidor; nenhuma mensagem interna é incluída no HTML público ou no GitHub.
- Cadastros, autenticação, indicadores e backups da base compartilhada mantidos.

## Versão 50.1 — 05/11/2026

- Refinamento visual do Meu dia conforme a ilustração aprovada: títulos e nomes de clientes mais destacados, indicadores alinhados e botões de ação com largura consistente.
- Cards brancos com bordas discretas, ícones mais leves e cores pontuais para seleção, atraso e atenção.
- Agenda, resumo mensal e seções recolhidas com espaçamento e tipografia padronizados; ajuste para telas menores.
- Transição sutil ao trocar as filas, respeitando a preferência por movimento reduzido.
- Cálculos, filtros, cadastros, autenticação e backups mantidos.

# v50 — 05/11/2026

- Meu dia reorganizado com os quatro indicadores, prioridades em Vencidos, Hoje e Clientes parados, agenda lateral e evolução mensal da carteira.
- Ações diretas para contato, follow-up, ficha e avaliação Health Score, com paginação para evitar telas longas.
- Clientes parados destacados após 7 dias sem movimentação, com critério ajustável para 7, 14, 21 ou 30 dias neste navegador.
- Atalho para retomar a última ficha consultada; histórico e revisão de cadastros mantidos recolhidos.
- Agenda utiliza datas reais, sem inventar horários. Churn identificado como exclusivo do Health Score; os quatro indicadores mantêm os cálculos existentes.
- Dados, autenticação, base compartilhada e backups preservados.

# Notas de versão — Central CS

## Versão 49 — 04/11/2026

- Posição de rolagem da lista preservada ao fechar fichas e formulários, com destaque discreto ao cliente consultado.
- Proteção de formulários com alterações não salvas ao fechar, pressionar Esc, trocar de formulário ou sair da página; salvamento válido libera a navegação. Rascunhos não são armazenados.
- Linha do tempo na ficha com chegada, contrato, onboarding, implantação e ativação e prazos calculados sem inventar datas.
- Prévia do último contato na tabela. Contatos e follow-ups são separados de alterações automáticas de cadastro; novos registros de contato recebem marcação explícita.
- Health Score sinaliza revisão após 30 dias da última avaliação respondida com critérios preenchidos ou alerta crítico. Churn e contatos sem resposta não renovam a avaliação; a nota permanece inalterada.
- Filtros, cadastros existentes e importações preservados.

## Versão 48.4 — 04/11/2026

- Cadastros organizados em seções, preservando todos os campos e regras existentes. Painel lateral com Cancelar e Salvar sempre acessíveis durante a rolagem.
- Identificação, contrato e implantação separados visualmente; Health Score com identificação e localização agrupadas.
- Fonte consistente, rótulos associados aos campos, foco visível e transições discretas com respeito à redução de movimento.
- Tabelas com nomes sem cortes, melhor contraste de CNPJ e datas, números alinhados e ações em posição consistente.
- Logo, cores das etapas, indicadores, dados e regras de negócio preservados.

## Versão 48.3 — 04/11/2026

- Cabeçalho compacto e confirmação discreta de sincronização, preservando avisos e recuperação em caso de falha.
- Quatro indicadores alinhados, estados vazios do Meu dia compactos e pendências destacadas. Registros com contraste e leitura melhores.
- Ícones do menu padronizados; troca de acesso e saída concentradas no perfil superior.
- Health Score sem clientes destaca importação e cadastro, com filtros exibidos quando há registros.
- Login com cartão centralizado, logo equilibrado, Entrar na largura dos campos e links secundários discretos. Orientação de usuário restrita ao cadastro.
- Dados, autenticação, importação e cálculos preservados.

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
