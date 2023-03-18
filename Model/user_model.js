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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Overriding toJSON method
// This is used for deleting some parameters we don't want to show in any response.
// I am hidding __v and password property


UserSchema.methods.toJSON = function() {
    const { __v, password, _id, ...cleanUser } = this.toObject();
    cleanUser.uid = _id
    return cleanUser
}


module.exports = model('user', UserSchema)

