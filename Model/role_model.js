const {Schema, model} = require('mongoose')

const RoleSchema = Schema({
    role: {
        type: String,
        unique: [true, 'role must be unique']
    },
    isEnabled: {
        type: Boolean,
        default: true
    }
}) 

module.exports = model('role', RoleSchema)