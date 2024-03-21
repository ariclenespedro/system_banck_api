const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser')
const express = require('express')
const server = express()

const queryParser = require('express-query-int')
const allowCors = require('./cors')

server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
server.use(queryParser());
server.use(allowCors);
server.use(express.static('public'));

// Iniciando o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
  

module.exports = server