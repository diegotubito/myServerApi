const { response } = require("express");
const Availability = require('./availability_model')
const Item = require('../Item/item_model')
const { hasOverlappingAvailability } = require('./availability_helper')

const createAvailability = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request error'
        })
    }

    const parsedStartDate = new Date(body.startDate);
    const parsedEndDate = new Date(body.endDate);
   

    if (parsedStartDate >= parsedEndDate) {
        return res.status(400).json({
            message: 'start date must be greater than end date.'
        })
    }

    let expiration = null
    if (body.expiration) {
        expiration = new Date(body.expiration)
        if (expiration < parsedEndDate) {
            return res.status(400).json({
                message: 'expiration date must be greater than end date.'
            })
        }    
    }

    const newBody = {
        period: body.period,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        service: body.service,
        expiration: expiration
    }

    const availability = await Availability(newBody)
    try {
        // Check if item is a service
        const item = await Item.findById(body.service)
        if (item.itemType != "service") {
            return res.status(400).json({
                message: 'request error, item is not a service.'
            })
        }

        const overlap = await hasOverlappingAvailability(newBody.service, parsedStartDate, parsedEndDate)

        if (overlap) {
            return res.status(400).json({
                message: 'request error, overlapping'
            })
        }

        const newObject = await availability.save()
        
        res.json({
            availability: newObject
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAvailabilities = async (req, res = response) => {
    const { serviceId } = req.query

    const filter = {
        service: serviceId
    }

    try {
        const [availabilities, count] = await Promise.all([
            await Availability.find(filter),
            await Availability.countDocuments(filter)
        ])

        res.json({
            count,
            availabilities
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })        
    }
}

const updateAvailability = async (req, res = response) => {
    const id = req.params._id 
    const {_id, service, isEnabled, ...body} = req.body

    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);

    if (startDate >= endDate) {
        return res.status(400).json({
            message: 'start date must be greater than end date.'
        })
    }

    let expiration = null
    if (body.expiration) {
        expiration = new Date(body.expiration)
        if (expiration < endDate) {
            return res.status(400).json({
                message: 'expiration date must be greater than end date.'
            })
        }    
    } else {
        body.expiration = null
    }

    const options = {
        new: true
    }

    try {
        const updatedDocument = await Availability.findByIdAndUpdate(id, body, options)
        if (!updatedDocument) {
            return res.status(400).json({
                message: 'could not update availability'
            }) 
        }
        res.json({
            availability: updatedDocument
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })  
    }

}

const deleteAvailability = async (req, res = response) => {
    const {_id} = req.params

    try {
        const deletedDocument = await Availability.findByIdAndDelete(_id)
        if (!deletedDocument) {
            return res.status(400).json({
                message: 'could not delete availability'
            }) 
        }
        res.json({
            availability: deletedDocument
        })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })          
    }
}

const deleteAllAvailability = async (req, res = response) => {
    
    try {
        const deletedDocument = await Availability.deleteMany()
        res.json('all availability were deleted')
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })          
    }
}

module.exports = {createAvailability, getAvailabilities, updateAvailability, deleteAvailability, deleteAllAvailability}