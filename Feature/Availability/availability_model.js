const { Schema, model } = require('mongoose')

const AvailabilityShchema = new Schema({
    dayOfWeek: {
        type: Number,
        required: true,
        min: 0,
        max: 6
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
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
    priceAdjustmentPercentage: {
        type: Number, // field can have positive values for increments and negative values for discounts.
        default: 0
    }
}, {timestamps: true} )

module.exports = model('availability', AvailabilityShchema)