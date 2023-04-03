const { response } = require("express");
const Availability = require('./availability_model')
const Product = require('../Product/product_model')

const createAvailability = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request error'
        })
    }

    const availability = await Availability(body)
    try {
        const newObject = await availability.save()

        const product = await Product.findById(body.product)
        if (!product) {
            return res.status(400).json({
                message: 'product not found'
            })
        }
        product.availabilities.push(newObject)
        await product.save()

        res.json(newObject)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAvailabilities = async (req, res = response) => {
    const { productId } = req.query

    const filter = {
        product: productId
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
    const {_id, product, isEnabled, ...body} = req.body

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