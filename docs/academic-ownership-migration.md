# Migração revisada de propriedade acadêmica

O script não descobre proprietários. Ele aplica um manifesto revisado com IDs
exatos e referência de evidência para cada grupo de documentos. `user_ras`, RA
atual, nome, timestamps e semestre não são evidência suficiente isoladamente.
Conteúdo já sobrescrito precisa de recuperação ou nova coleta confiável.

## Preparação

1. Garantir backup, replica set e parser com o contrato do ADR 0002.
2. Pausar escritores antigos e preparar evidências fora do repositório público.
3. Separar documentos inequívocos dos ambíguos. Não incluir ambíguos no manifesto.
4. Executar simulação, revisar contagens e então aplicar o mesmo arquivo.
5. Implantar API e clientes em conjunto. Eventos antigos ficam pendentes;
   não são reaplicados buscando dono por RA. Fazer nova coleta autenticada.

O manifesto tem esta estrutura (IDs e valores abaixo são sintéticos):

```json
{
  "entries": [{
    "userId": "000000000000000000000001",
    "ra": "111",
    "evidenceRef": "review-example",
    "records": [{
      "collection": "enrollments",
      "id": "000000000000000000000002"
    }],
    "commentIds": [],
    "releaseCurrentRa": false
  }]
}
```

Coleções aceitas: `alunos`, `enrollments`, `histories`, `historiesgraduations`.
`validFrom`/`validTo` são opcionais, em ISO UTC; omitir quando desconhecidos.
Cada entrada representa uma ocorrência histórica distinta. Documentos atribuídos
recebem vínculo encerrado e `active = false`; não são reativados. `commentIds`
somente inclui autoria comprovada separadamente e exige matrícula da mesma
identidade. Documentos já atribuídos a outro vínculo não podem ser movidos.

Para liberar um RA atualmente contestado, usar entrada revisada para seu titular
anterior com `releaseCurrentRa: true` e o RA esperado. Isso encerra o vínculo
atual correspondente, desativa seus dados e limpa a projeção na conta. Não
transfere nenhum registro. Depois, uma nova sincronização pode confirmar outro
titular. O RA esperado protege contra alterações ocorridas desde a revisão.

## Execução

Defina `MONGODB_CONNECTION_URL` no ambiente por um mecanismo local seguro.
Não coloque credenciais nem o manifesto real no repositório ou em logs públicos.
Execute de `apps/core`:

```sh
pnpm exec tsx src/scripts/migrate-academic-ownership.ts /caminho/manifesto.json
pnpm exec tsx src/scripts/migrate-academic-ownership.ts /caminho/manifesto.json --apply
```

O primeiro comando não grava. O segundo valida e aplica em uma transação.
IDs repetidos, intervalos inválidos, RA divergente, documentos inexistentes e
tentativas de substituir propriedade abortam o lote inteiro. O mesmo manifesto
é idempotente. O relatório imprime somente digest e contagens.

Dividir volumes grandes em lotes revisados, dentro do limite operacional de uma
transação. Preservar os manifestos e suas evidências em armazenamento privado
de auditoria. IDs e datas de validade não são inferidos pelo script.

Validar em ambiente de teste antes da produção: proprietário anterior conserva
acesso, novo titular não vê seus registros, jobs antigos não reativam dados e
contas sem identidade não recebem fallback por RA. Os índices obrigatórios são
criados pela API antes de aceitar requisições; duplicidades impedem inicialização.
