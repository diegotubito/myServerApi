const express = require('express')
const app = express()
const cors = require('cors')
const {connectDataBase} = require('../Database/database')


class Server {
    constructor() {
        this.app = app
        
        this.#middleware()

        this.#router()
    }

    #middleware() {
        this.app.use(cors())
        this.app.use(express.json())
    }

    #router() {
        this.app.use('', require('../Router/user_router'))
        this.app.use('/api/v1/auth', require('../Router/login_router'))
        this.app.use('/api/v1/stripe', require('../Router/stripe_route'))
        this.app.use('/api/v1/mp', require('../Router/mp_link_router'))
        this.app.use('/api/v1/mp/sdk', require('../Router/mp_sdk_router'))
    }

    connect() {
        this.app.listen(process.env.PORT, () => {
            console.log('Server running at', process.env.PORT)
            this.#connectDB()
        })
    }

    #connectDB() {
       connectDataBase()
    }
}

module.exports = Server