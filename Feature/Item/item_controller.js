const { response } = require("express")
const Item = require('./item_model')
const Spot = require('../Spot/spot_model')

const createItem = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request body needed'
        })
    }

    const newItem = new Item(body)
    try {
        
        //push a the new item to Spot document
        const spotDocument = await Spot.findById(body.spot)
        if (!spotDocument) {
            return res.status(400).json({
                message: 'spot does not exist'
            })
        }
        spotDocument.items.push(newItem)
      
        await newItem.save()
        await spotDocument.save()

        res.json({
            item: newItem
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const getItem = async (req, res = response) => {
    const { spotId } = req.query

    const filter = {
        isEnabled: true,
        spot: spotId
    }
   
    try {
        const [ items, count ] = await Promise.all([
            Item.find(filter)
            .populate({
                path: 'availabilities',
                match: {isEnabled: true}
            }),
            Item.countDocuments(filter)
        ])
        
        res.json({
            count, items
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const updateItem = async (req, res = response) => {
    const id = req.params.id
    const body = req.body

    const {user, _id, isEnabled, ... updates} = body

    const options = {
        new: true
    }

    try {
        const updated = await Item.findByIdAndUpdate(id, updates, options)
        if (!updated) {
            return res.status(400).json({
                message: 'could not update item'
            })
        }
        res.json(updated)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const deleteItem = async (req, res = response) => {
    const id = req.params.id

    const options = {
        new: true
    }

    try {
        const deleted = await Item.findByIdAndDelete(id, options)
        if (!deleted) {
            return res.status(400).json({
                message: 'could not delete item'
            })
        }
        res.json(deleted)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { createItem, getItem, deleteItem, updateItem }