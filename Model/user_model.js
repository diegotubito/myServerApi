const {Schema, model} = require('mongoose')

const PointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    street : {
        type : String,
        required: [true, 'Street is required'],
    },
    streetNumber: {
        type: Number,
        require: [true, 'Street number is required']
    },
    cp: {
        type : String,
    }, 
    locality: {
        type : String,
    },
    state : {
        type : String,
    },
    country : {
        type : String,
    }
});

const UserSchema = Schema({
    username: {
        type: String,
        unique: [true, 'username must be unique'],
        required: [true, 'username field is required']
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
    location: {
        type: PointSchema
    },
    phoneNumber : {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    }
})

// Overriding toJSON method
// This is used for deleting some parameters we don't want to show in any response.
// I am hidding __v and password property


UserSchema.methods.toJSON = function() {
    const { __v, password, ...cleanUser } = this.toObject();
    return cleanUser
}

module.exports = model('user', UserSchema)

