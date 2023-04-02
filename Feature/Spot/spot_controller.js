const { response } = require("express")
const Spot = require('./spot_model')

const getSpot = async (req, res = response) => {
    try {
        const filter = {
            isEnabled: true
        }

        const productsFilter = { 
            isEnabled: true,
            type: req.query.filterProductsByType
        }

        const [spots, count] = await Promise.all([
            Spot.find(filter)
            .populate({
                path: 'products',
                match: productsFilter
            }),
            Spot.countDocuments(filter)
        ])
       
        res.json({count, spots})        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
    }
}

const createSpot = async (req, res = response) => {
    const {createdAt, ...body} = req.body

    const spot = Spot(body)
    try {
        const newSpot = await spot.save()
        res.json(newSpot)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteSpot = async (req, res = response) => {
    const _id = req.params._id
    
    try {
        const spot = await Spot.findByIdAndDelete(_id)
        res.json(spot)        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateSpot = async (req, res = response) => {
    const body = req.body
    const id = req.params._id

    const { createdAt, _id, isEnabled, ... filterBody } = body

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const updated = await Spot.findByIdAndUpdate(id, filterBody, options)
        res.json(updated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deactivateSpot = async (req, res = response) => {
    const _id = req.params._id
    const query = {
        isEnabled: false
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const updated = await Spot.findByIdAndUpdate(_id, query, options)
        res.json(updated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })    
    }
}

const activateSpot = async (req, res = response) => {
    const _id = req.params._id
    const query = {
        isEnabled: true
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const updated = await Spot.findByIdAndUpdate(_id, query, options)
        res.json(updated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })   
    }
}

const getNearSpot = async (req, res = response) => {
    const coordinates = req.body.coordinates
    const distance = Number(req.body.distance)

    if (!coordinates || !distance) {
        return res.status(400).json({
            message: 'request error'
        }) 
    }
   
    const query = {
        isEnabled: true,
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: distance
            }
        }
    };

    const productsFilter = { 
        isEnabled: true,
        type: req.query.filterProductsByType
    }

    // counts doesn't work with this kind or $near query
    try {
        const nearSpots = await Spot.find(query)
        .populate({
            path: 'products',
            match: productsFilter
        })
        res.json({
            spots: nearSpots
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        }) 
    }
}

module.exports = { getSpot, createSpot, updateSpot, deleteSpot, deactivateSpot, activateSpot, getNearSpot }