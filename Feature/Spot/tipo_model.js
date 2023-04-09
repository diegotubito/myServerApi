const { Schema, model } = require('mongoose')

const TipoSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = model('tipo', TipoSchema)