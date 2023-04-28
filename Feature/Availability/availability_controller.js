const { response } = require("express");
const Availability = require('./availability_model')
const Item = require('../Item/item_model')
const { parseDateIgnoringTimeZone, parseTime } = require('../../Common/date_helper')
const { hasOverlappingAvailability } = require('./availability_helper')


const createAvailability = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request error'
        })
    }
    /*
    const startTime = `01/01/2001T${body.startTime}` 
    const endTime = `01/01/2001T${body.endTime}` 
    const parsedStartTime = parseDateIgnoringTimeZone(startTime);
    const parsedEndTime = parseDateIgnoringTimeZone(endTime);
*/

    const parsedStartTime = parseTime(body.startTime);
    const parsedEndTime = parseTime(body.endTime);


    const newBody = {
        dayOfWeek: body.dayOfWeek,
        startTime: parsedStartTime,
        endTime: parsedEndTime,
        priceAdjustmentPercentage: body.priceAdjustmentPercentage,
        service: body.service
    }

    const availability = await Availability(newBody)
    try {
     
        /*
        const item = await Item.findById(newBody.service)
        if (!item || item.itemType != 'service') {
            return res.status(400).json({
                message: 'item not found or the item is not a service'
            })
        }
        item.availabilities.push(availability)
        await item.save()
*/


        const overlap = await hasOverlappingAvailability(newBody.service, availability.dayOfWeek, parsedStartTime, parsedEndTime)

        if (overlap) {
            return res.status(400).json({
                message: 'request error, overlapping'
            })
        }

        const newObject = await availability.save()
        res.json(newObject)
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
        res.json(updatedDocument)
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
        res.json(deletedDocument)
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })          
    }
}

module.exports = {createAvailability, getAvailabilities, updateAvailability, deleteAvailability}