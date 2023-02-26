const express = require('express')
const app = express()
const mongoose = require('mongoose')

class Server {
    constructor() {
        this.app = app
        
        this.middleware()

        this.router()
    }

    middleware() {
        this.app.use(express.json())
    }

    router() {
        this.app.use('', require('../Router/user_router'))
    }

    connect() {
        this.app.listen(3000, () => {
            console.log('Server running at 3000')
            this.connectDB()
        })
    }

    connectDB() {
        mongoose.set('strictQuery', true)
        mongoose.connect('mongodb+srv://cafe:Xx4109SOReN1DLR8@cluster0.jfb6n.mongodb.net/temperature', (error, response) => {
            if (error) {
                console.log(error)
            } else {
                console.log('database connected')
            }
       })
    }
}

module.exports = Server