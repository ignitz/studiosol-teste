# Teste Prático - Studio Sol
Para ser simples e direto o teste foi feito com o Nodejs v10.15.3.

O programa recebe como entrada o tamanho do relógio dado na especificação e depois
escolhe a Timezone desejada (A escolha da timezone pode ser escolhido digitando parcialmente).

Para reiniciar a aplicação basta apertar a tecla "Enter/Return".

Caso deseje sair, na opção da escolha do tamanho do relógio existe a opção **Sair**.

Existem duas opções para rodar o teste.
 - Pelo próprio Node.
 - Docker

## Node

Instalar as dependências
```
$ npm install
```
ou
```
$ yarn
```

Como o comando é simples não criei scripts no *package.json* para não complicar.

```
$ node index.js
```

## Docker

Para rodar no Docker, basta executar os dois comandos a seguir.

### Criar a imagem

```
$ docker build --rm -f "Dockerfile" -t studiosol:latest .
```

### Rodar a imagem

```
$ docker run -it --rm studiosol
```