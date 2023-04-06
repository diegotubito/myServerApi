const { response } = require("express")
const Item = require('./item_model')
const Spot = require('../Spot/spot_model')
const mongoose = require('mongoose')

const createItem = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request body needed'
        })
    }

    const newItem = new Item(body)
    try {
        await newItem.save()
   
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
    }

    if (spotId) {
        filter.spot = spotId
    }

    try {
        const [ items, count ] = await Promise.all([
            Item.find(filter),
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

module.exports = { createItem, getItem, deleteItem, updateItem}