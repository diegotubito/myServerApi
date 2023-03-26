require('dotenv').config()
const Server = require('./Module/server')
const server = new Server()
server.connect()