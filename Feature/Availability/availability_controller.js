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

    const newBody = {
        period: body.period,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        service: body.service
    }

    const availability = await Availability(newBody)
    try {
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