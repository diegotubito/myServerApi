const mongoose = require('mongoose')

const connectDataBase = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect('mongodb+srv://cafe:Xx4109SOReN1DLR8@cluster0.jfb6n.mongodb.net/temperature')
        console.log('connected database')
    
    } catch (error) {
        console.log(error)
        throw new Error('Error connected DB')
    }
}

module.exports = { connectDataBase }