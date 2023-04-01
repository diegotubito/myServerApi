const mongoose = require('mongoose')

const connectDataBase = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect('mongodb+srv://cafe:csO53O7AqCa2RTWu@cluster0.jfb6n.mongodb.net/teams')
        console.log('connected database')
    
    } catch (error) {
        console.log(error)
        throw new Error('Error connected DB')
    }
}

module.exports = { connectDataBase }