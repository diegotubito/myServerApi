const { response } = require("express")
const Item = require('./item_model')
const Image = require('../Image/image_model')
const Spot = require('../Spot/spot_model')
const mongoose = require('mongoose')

const createItem = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request body needed'
        })
    }
    try {
        // Save images and get their _ids
        const imageDocs = await Promise.all(body.images.map(image => {
            const {_id, ...img} = image // remove _id param that comes from the client
            const newImage = new Image(img);
            return newImage.save().then(savedImage => savedImage);
        }));

        const { images, ...newBody } = body
        
        const newItem = new Item(newBody);

        newItem.images = imageDocs

        // Save the item
        const savedItem = await newItem.save();

        res.json({
            item: savedItem
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
    }

    if (spotId) {
        filter.spot = spotId
    }

    try {
        const [ items, count ] = await Promise.all([
            Item.find(filter)
            .populate('images')
            .populate({
                path: 'spot',
                populate: 'tipos'
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
    
    const filteredUpdates = Object.entries(updates)
    .filter(([key, value]) => value!== null && value!== undefined &&!(Array.isArray(value) && value.length === 0))
    .reduce((obj, [key, value]) => ({...obj, [key]: value }), {});

    console.log(filteredUpdates)
    const options = {
        new: true
    }

    try {
        const updated = await Item.findByIdAndUpdate(id, filteredUpdates, options)
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

        for(index=0; index < deleted.images.length; index++) {
            const imageId = deleted.images[index]._id
            await Image.findByIdAndDelete(imageId)
        }

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

module.exports = { createItem, getItem, deleteItem, updateItem}