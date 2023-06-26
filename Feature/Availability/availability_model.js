const { Schema, model } = require('mongoose')

const AvailabilityShchema = new Schema({
    period: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    expiration: {
        type: Date
    }
}, {timestamps: true} )

module.exports = model('availability', AvailabilityShchema)