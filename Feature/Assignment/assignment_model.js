const { Schema, model } = require('mongoose')

const AssignmentSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    availability: {
        type: Schema.Types.ObjectId,
        ref: 'availability',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    status: {
        type: String,
        enum: ['user-pending', 'owner-accepted', 'owner-rejected', 'user-scheduled', 'user-cancelled'],
        default: 'user-pending'
    },
    startDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {timestamps: true});

module.exports = model('assignment', AssignmentSchema)