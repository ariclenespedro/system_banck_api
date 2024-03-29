const mongoose = require("mongoose");
/* const args = require("args-parser")(process.argv);
mongoose.Promise = require("bluebird"); */

async function main() {
  try {
    // Conexão com o MongoDB
    mongoose
      .connect("mongodb://localhost:27017/system_bank_db")
      .then(() => {
        console.log("Conexão com o MongoDB estabelecida");
      })
      .catch((err) => {
        console.error("Erro ao conectar ao MongoDB", err);
      });
  } catch (error) {
    console.log(error);
  }
}

mongoose.Error.messages.general.required = "O campo '{PATH}' é obrigatório.";
mongoose.Error.messages.Number.min =
  "O '{PATH}' informado é menor que o limite mínimo de '{MIN}'.";
mongoose.Error.messages.Number.max =
  "O '{PATH}' informado é maior que o limite máximo de '{MAX}'.";
mongoose.Error.messages.String.enum =
  "O '{VALUE}' não é válido para o campos '{PATH}'.";

  module.exports = main;