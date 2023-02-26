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
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('user', UserSchema)