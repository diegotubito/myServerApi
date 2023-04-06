const { Schema, model } = require('mongoose')

const ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },    
    itemType: {
        type: String,
        enum: ['product', 'service'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    duration: {
        type: Number,
        required: function () {
            return this.itemType === 'service';
        },
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: "spot",
        required: true
    }
}, {timestamps: true} )

module.exports = model('item', ItemSchema)