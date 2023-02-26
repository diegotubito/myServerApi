const {Schema, model} = require('mongoose')

const UserSchema = Schema({
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('user', UserSchema)