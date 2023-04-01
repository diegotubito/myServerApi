const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    capacity: {
        type: Number
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('product', ProductSchema)