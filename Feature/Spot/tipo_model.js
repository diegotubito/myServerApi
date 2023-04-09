const { Schema, model } = require('mongoose')

const TipoSchema = new Schema({
    type: {
        type: String,
    },
    icon: {
        type: String,
    },
    tintColor: {
        type: String,
    }
})

module.exports = model('tipo', TipoSchema)