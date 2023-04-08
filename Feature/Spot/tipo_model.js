const { Schema, model } = require('mongoose')

const TipoSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model('tipo', TipoSchema)