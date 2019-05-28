const axios = require("axios");
const readline = require("readline");

const prompts = require("prompts");

const moment = require("moment");
require("moment-timezone");

/**
 * Segue o esquema do segmento 7
 *  __
 * |__|
 * |__|
 *
 *   0
 * 1   2
 *   3
 * 4   5
 *   6
 *
 */
const sevendigit = {
  "0": [1, 1, 1, 0, 1, 1, 1],
  "1": [0, 0, 1, 0, 0, 1, 0],
  "2": [1, 0, 1, 1, 1, 0, 1],
  "3": [1, 0, 1, 1, 0, 1, 1],
  "4": [0, 1, 1, 1, 0, 1, 0],
  "5": [1, 1, 0, 1, 0, 1, 1],
  "6": [1, 1, 0, 1, 1, 1, 1],
  "7": [1, 0, 1, 0, 0, 1, 0],
  "8": [1, 1, 1, 1, 1, 1, 1],
  "9": [1, 1, 1, 1, 0, 1, 1]
};

/**
 * Aqui desenha a parte de cima do relógio
 * @param {Array} arrTime
 * @param {int} size Tamanho do relógio
 */
const drawTopLine = (arrTime, size = 1) => {
  let response = "";

  const SEGMENT = 0;
  let count = 1;

  arrTime.forEach(digit => {
    let howMany = size;
    response += " ";
    while (howMany--) {
      response += sevendigit[digit][SEGMENT] ? "__" : "  ";
    }
    response += " ";
    response += " ".repeat(size - 1);

    if (count % 2 == 0) response += "   ";

    count++;
  });

  return response.concat("\n");
};

/**
 * Aqui desenha a segunda linha em diante do relógio.
 * Top e bottom são separados do segmento médio horizontal.
 *
 * @param {Array} arrTime
 * @param {String} position top or bottom
 * @param {int} size tamanho do relógio
 */
const drawInterLine = (arrTime, position = "top", size = 1) => {
  let response = "";

  const SEGMENT1 = position === "top" ? 1 : 4;
  const SEGMENT2 = position === "top" ? 2 : 5;
  const SEGMENT3 = position === "top" ? 3 : 6;

  // Pra printar os dois pontos de separação
  let bolota = 0;
  // Contador pra inserir as bolotas
  let count = 1;
  // Indicar o tamanho para estender verticalmente
  let vertSize = size - 1;

  // Adicionando as linhas verticais
  while (vertSize--) {
    arrTime.forEach(digit => {
      let howMany = size;

      response += sevendigit[digit][SEGMENT1] ? "|" : " ";
      while (howMany--) {
        response += "  ";
      }
      response += sevendigit[digit][SEGMENT2] ? "|" : " ";
      response += " ".repeat(size - 1);

      if (count % 2 == 0) {
        if (position === "bottom" && bolota < 2) {
          response += " º ";
          bolota++;
        } else {
          response += "   ";
        }
      }

      count++;
    });
    response += "\n";
  }

  count = 1;

  // Adicionando as linhas verticais e horizontais
  // Ou seja o segmento médio horizontal o de baixo
  arrTime.forEach(digit => {
    let howMany = size;

    response += sevendigit[digit][SEGMENT1] ? "|" : " ";
    while (howMany--) {
      response += sevendigit[digit][SEGMENT3] ? "__" : "  ";
    }
    response += sevendigit[digit][SEGMENT2] ? "|" : " ";
    response += " ".repeat(size - 1);

    if (count % 2 == 0) {
      if (position === "top" && bolota < 2) {
        response += " º ";
        bolota++;
      } else if (size == 1 && position === "bottom" && bolota < 2) {
        response += " º ";
        bolota++;
      } else {
        response += "   ";
      }
    }

    count++;
  });

  return response.concat("\n");
};

/**
 * A função desenha o relógio no terminal.
 *
 * @param {Array} digits Array contendo os digitos
 * @param {int} size tamanho do relógio
 */
const drawTime = (digits, size = 1) => {
  let response = "\033c";
  response += drawTopLine(digits, size);
  response += drawInterLine(digits, "top", size);
  response += drawInterLine(digits, "bottom", size);
  console.log(response);
  console.log("Aperte enter para reiniciar!");
};

/**
 * Retorna um Array de tamanho 6 contendo cada dígito.
 * @param {String} inputTime Tempo em formato hh:mm:ss
 */
const extractDigits = inputTime => {
  return (
    inputTime.substr(0, 2) +
    inputTime.substr(3, 2) +
    inputTime.substr(6, 2)
  ).split("");
};

/**
 * Extrai o Array contendo os digitos necessários.
 * @param {DateISOString} dateString
 */
const getInputFormat = dateString => {
  return extractDigits(dateString.substr(String("YYYY-MM-DDT").length, 8));
};

/**
 * Faz um request da lista dos timezones.
 * Retorna um array de Strings.
 */
const getTimezones = async () => {
  try {
    const response = await axios.get("http://worldtimeapi.org/api/timezone");
    return response.data;
  } catch {
    throw new Error("Erro to access API timezone");
  }
};

/**
 * Função principal.
 */
const main = async () => {
  /**
   * Faz loop para caso o usuário queira repetir.
   */
  while (true) {
    const timezones = await getTimezones();

    const choice = await prompts({
      type: "select",
      name: "size",
      message: "Escolha o tamanho do relógio",
      choices: [
        { title: "Sair", value: 0 },
        { title: "1", value: 1 },
        { title: "2", value: 2 },
        { title: "3", value: 3 },
        { title: "4", value: 4 },
        { title: "5", value: 5 }
      ],
      initial: 0
    });

    // Caso o usuário deseje sair do programa.
    if (choice.size === 0) {
      process.exit(0);
    }

    // Escolha da Timezone
    const choicetz = await prompts({
      type: "autocomplete",
      name: "value",
      message: "Escolha o Timezone desejado!",
      choices: timezones.map(tm => {
        return {
          title: tm
        };
      })
    });

    let url = "http://worldtimeapi.org/api/timezone";
    choicetz.value.split("/").forEach(foo => {
      url += "/" + foo;
    });

    const response = await axios.get(url);
    const date = moment.tz(response.data.datetime, choicetz.value);

    const running = setInterval(async () => {
      drawTime(extractDigits(date.format("hh:mm:ss")), choice.size);

      date.add(1, "second");
    }, 1000);

    await prompts({
      type: "text",
      name: "dummy",
      message: ""
    });

    console.log("\033c");

    clearInterval(running);
  }
};

main();
