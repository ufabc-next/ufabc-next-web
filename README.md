# ufabc-next-frontend-v2

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your unit tests
```
yarn test:unit
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



### Mobile version 

npx cap open android 

Requirementos: Android studio, Java a partir da versão 11 

Adicionar o atributo "android.overridePathCheck=true" no arquivo gradle.properties 

As configurações de AVD foram feitas automaticamente 

Instalar Gradle localmente versão 8.x ou usar o Wrapper

Foi necessário configurar o build do projeto no android studio no caminho settings > build tools 
nessa fase foi necessário utilizar o jDK 11 -> Pode usar o coretto da Amazon 

Durante o run da aplicação foi necessário entrar no mesmo caminho settings > build tools e trocar a JDK para 17 - jbr-17 

