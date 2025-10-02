# Email Service

Esse projeto permite que renderize templates de vue-email, compile e faca upload para o SES. Além disso é possível fazer uma visualização dos temaplates em tempo real.

## Compilar e renderizar templates vue-email para html + txt

```bash
yarn build:rollup
```

## Upload para o SES

```bash
yarn deploy
```

## Visualizando os templates

Suba o servidor do vite:

```bash
yarn dev
```

Informe o nome do template que deseja visualizar desta forma:
\
`http://localhost:porta/Nome-do-Template`

(**Atenção**: o arquivo do template precisa estar na pasta `templates`, e não é necessário adicionar a extensão `.vue`)
