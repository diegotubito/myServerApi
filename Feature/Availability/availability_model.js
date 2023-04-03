const { Schema, model } = require('mongoose')

const AvailabilityShchema = new Schema({
    dayOfWeek: {
        type: Number,
        required: true
    },
    startsAt: {
        type: Date,
        required: true
    },
    endsAt: {
        type: Date,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
})

module.exports = model('availability', AvailabilityShchema)