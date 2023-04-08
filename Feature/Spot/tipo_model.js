const { Schema, model } = require('mongoose')

const TipoSchema = new Schema({
    name: {
        type: String
    }
})

module.exports = model('tipo', TipoSchema)