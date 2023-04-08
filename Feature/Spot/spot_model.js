const { Schema, model, SchemaType } = require('mongoose')

const PointSchema = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      unique: [true, 'spot coordintates must be unique'],
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

const ContactInformationSchema = new Schema({
    phoneNumber: {
        type: String
    },
    email: {
        type: String
    }
})

const SpotSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'spot name must be unique'],
        required: [true, 'spot name is required']
    },
    description: {
        type: String
    },
    thumbnailImage: {
        type: String
    },
    location: {
        type: PointSchema
    },
    contactInformation: {
        type: ContactInformationSchema
    },
    isEnabled: {
        type: Boolean,
        default: true
    },
    tipos: [{
        type: Schema.Types.ObjectId,
        ref: 'tipo'
    }]
}, {timestamps: true})

SpotSchema.index({ location: "2dsphere" });

module.exports = model('spot', SpotSchema)