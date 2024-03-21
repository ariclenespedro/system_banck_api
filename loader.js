const server = require('./src/config/server')
require('./config/database')
require('./config/routes')(server)