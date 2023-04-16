const { Schema, model } = require('mongoose')
const ImageSchema = require('../Image/image_model')

const ItemSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    subtitle: {
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
    },
    images: [Schema.Types.Mixed]
}, {timestamps: true} )

ItemSchema.methods.toJSON = function() {
    const { __v, ...cleanItem } = this.toObject();
    return cleanItem
}

module.exports = model('item', ItemSchema)