# ADR 0002: Propriedade acadêmica independente de RA

## Decisão

`AcademicIdentity` é permanente e pertence explicitamente à conta. `Student`
continua sendo um retrato acadêmico. Cada ocorrência de associação de uma
identidade a um RA recebe um `AcademicRaBinding` distinto. Retornar a um RA
anterior cria outro vínculo; não reabre documentos antigos.

Os registros carregam `academicBindingId`, `ownerIdentityId`,
`ownershipStatus`, `sourceOperationId` e `recordKey`. A autorização exige
propriedade confirmada, uma conta ativa e vínculo pertencente à sua identidade.
Não há fallback por RA nem por `user_ras`. `active` não determina propriedade.
O RA de um JWT antigo não participa da decisão. Comentários têm `authorUserId`;
autoria legada precisa de revisão separada.

Há um vínculo atual por identidade e por RA/instituição, garantido por índices
únicos parciais. Vínculos antigos não são únicos por RA. Datas de validade
desconhecidas permanecem nulas; verificação e encerramento observados têm datas
próprias. MongoDB exige replica set para as transações. As referências entre
coleções são verificadas pelos serviços; `ref` não é uma foreign key.

## Sincronização e confiança

`POST /v2/students/sigaa` recebe os mesmos hints de login/RA e sessão. Ele
persiste uma `AcademicSyncOperation` antes de chamar o parser e envia
`x-sync-operation-id`. A solicitação não altera RA, vínculo ou propriedade.

O parser, fora deste workspace, precisa devolver no `data` dos eventos
`student.synced`, `student.failed` e `class.settled`:

- `operationId`: valor da solicitação original, preservado em todos os retries;
- `verifiedSession.login` e `verifiedSession.ra`: extraídos no servidor da mesma
  sessão SIGAA e do vínculo selecionado que produziram o payload.

Esses campos NÃO podem ser cópias dos hints do navegador, nem ser resolvidos
consultando o atual dono do RA. A autenticação do webhook continua obrigatória.
RA externo, RA do payload, RA do Student e login esperado precisam concordar.
Não se assume que `studentKey` ou `aluno_id` sejam identificadores permanentes
de pessoa; essa semântica ainda precisa ser comprovada na integração externa.

A conclusão verificada cria a identidade quando necessário, encerra o vínculo
anterior, desativa seus documentos, cria o novo vínculo e grava históricos
numa transação. Conflito com outro vínculo atual ou conta legada não é resolvido
por tempo de atualização: requer revisão explícita, sem transferir documentos.

Jobs derivados usam a operação persistida. Cada gravação de Enrollment escreve
também a revisão do vínculo na mesma transação e exige que ele continue atual
e associado àquela operação. Fechamento ou sincronização posterior invalida jobs
antigos. Replay da conclusão usa o hash do payload para rejeitar conteúdo
divergente; despacho de jobs depois do commit pode ser repetido com segurança.
Timeout de despacho ao parser mantém a operação aguardando: um callback válido
ainda pode concluir. Sem callback, é necessária nova solicitação.

Os índices de registros usam vínculo + chave de origem (período e turma,
ou período e código da disciplina quando não existe turma,
para Enrollment; curso/grade para históricos), independentemente de `active`.
Não há matching aproximado de disciplina para decidir propriedade ou deduplicar
tentativas diferentes. Caches e estado de sincronização por RA deixam de
participar desse fluxo; `AcademicSyncOperation` é sua proveniência persistente.

Eventos antigos sem correlação/prova e mensagens das filas legadas são
preservados em `academic_pending_events`. `class.settled` só produz matrículas
com prova de sessão correspondente à operação aplicada. Aguarda por retry
quando a sincronização ou o catálogo ainda não foram processados; verifica
novamente o vínculo dentro da transação de gravação. O evento adiciona/atualiza
as turmas informadas e não remove matrículas ausentes nem apaga notas ou
coeficientes do histórico. Não se atribui evento ao atual dono do RA.

## Consulta e apresentação

As rotas existentes de histórico, matrículas e notas incluem vínculos encerrados.
A ficha individual permite filtrar por ocorrência de vínculo e identifica o RA
de cada registro. Históricos de curso mantêm coeficientes separados; não se
somam aproveitamentos nem se concatenam históricos para recalcular notas.
O gráfico padrão prioriza histórico ativo, com fallback ao último próprio.

Rotas de dados pessoais exigem JWT. As rotas de Student usadas pela extensão
(`GET/PUT /v2/students`, `GET/PUT /entities/students`) e a consulta de cortes
aceitam também `x-academic-token`, credencial opaca de escopo acadêmico emitida
na solicitação SIGAA. Ela só autoriza após a operação aplicada, expira em 24h
e exige conta ativa/confirmada, mesma identidade, vínculo atual e última operação.
O banco armazena somente o hash; o parser nunca recebe esse segredo. A credencial
não autoriza comentários, gestão de conta ou outras rotas do portal.

`GET /v2/students/sigaa/status` recebe a mesma credencial e retorna somente o
estado da operação, inclusive enquanto aguarda confirmação. A extensão consulta
por até cinco minutos e só mostra sucesso e salva o novo Student após `applied`.
Históricos estão persistidos nesse ponto; jobs de Enrollment podem ainda estar
em processamento. Credenciais são separadas por API e login na extensão.
Sessão de matrícula ou RA isolado não autoriza leitura; `/entities/enrollments/wpp`
continua exigindo JWT. Logs removem a credencial de cabeçalhos e respostas.

## Migração e implantação

O corte de leitura é conservador: documentos sem propriedade confirmada ficam
inacessíveis pela API pessoal até migração revisada ou nova coleta autenticada.
Não executar essa versão em produção antes de adaptar o parser e preparar o
manifesto. Ver `docs/academic-ownership-migration.md`.

Não há execução automática de migração nem fusão automática de contas. Exclusão
e recriação de conta não herdam identidade por coincidência de e-mail ou RA.
Recuperação de uma identidade existente exige procedimento explícito de revisão.
