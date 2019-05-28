# Teste Prático - Studio Sol
Para ser simples e direto o teste foi feito com o Nodejs v10.15.3.

O programa recebe como entrada o tamanho do relógio dado na especificação e depois
escolhe a Timezone desejada (A escolha da timezone pode ser escolhido digitando parcialmente).

Existem duas opções para rodar o teste.

## Node

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