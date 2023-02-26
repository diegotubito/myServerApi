const express = require('express')
const app = express()
const {connectDataBase} = require('../Database/database')

class Server {
    constructor() {
        this.app = app
        
        this.#middleware()

        this.#router()
    }

    #middleware() {
        this.app.use(express.json())
    }

    #router() {
        this.app.use('', require('../Router/user_router'))
    }

    connect() {
        this.app.listen(3000, () => {
            console.log('Server running at 3000')
            this.#connectDB()
        })
    }

    #connectDB() {
       connectDataBase()
    }
}

module.exports = Server