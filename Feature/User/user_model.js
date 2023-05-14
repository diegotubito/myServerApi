const {Schema, model} = require('mongoose')

const Notification = new Schema({
    deviceToken: {
        type: String,
        unique: true
    }
})

const UserSchema = Schema({
    username: {
        type: String,
        unique: [true, 'username must be unique'],
        required: [true, 'username field is required']
    },
    spot: {
        type: Schema.Types.ObjectId,
        ref: 'spot'
    },
    email: {
        type: String,
        unique: [true, 'email must be unique'],
        required: [true, 'email field is required']
    },
    password: {
        type: String,
        require: [true, 'password field is required']
    },
    firstName : {
        type : String, 
        required : [true, 'firstName field is required.']
    },
    lastName : {
        type : String, 
        required : [true, 'lastname field is required.']
    },
    thumbnailImage : {
        type : String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        required: [true, 'User role is required']
    },
    phoneNumber : {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    deviceTokens: [{
        type: String,
        unique: true
    }]
})

// Overriding toJSON method
// This is used for deleting some parameters we don't want to show in any response.
// I am hidding __v and password property

UserSchema.methods.toJSON = function() {
    const { __v, password, ...cleanUser } = this.toObject();
    return cleanUser
}

module.exports = model('user', UserSchema)

