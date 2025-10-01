# Email Service

Esse projeto permite que renderize templates de vue-email, compile e faca upload para o SES

## Compilar e renderizar templates vue-email para html + txt

```bash
yarn build
```

## Upload para o SES

```bash
yarn deploy
```

## Environment Variables

- `AWS_ENDPOINT_URL`: Set to `http://localhost:4566` for LocalStack
- `AWS_REGION`: AWS region (default: `us-east-1`)
- `AWS_ACCESS_KEY_ID`: AWS access key (default: `test` for LocalStack)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key (default: `test` for LocalStack)
