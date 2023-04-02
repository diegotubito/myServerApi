const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
        type: String
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
    spot: {
        type: Schema.Types.ObjectId,
        ref: "spot",
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

ProductSchema.index({ spot: "2dsphere"});

module.exports = model('product', ProductSchema)