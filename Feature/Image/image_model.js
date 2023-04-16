const { Schema, model } = require('mongoose')

const ImageSchema = new Schema({
    url: {
        type: String,
        required: [true, 'url image is required']
    },
    thumbnail: {
        type: String
    }
}, {timestamps: true} )

module.exports = model('image', ImageSchema)