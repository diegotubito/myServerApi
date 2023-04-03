const { response } = require("express")
const Product = require('./product_model')
const Spot = require('../Spot/spot_model')

const productCreate = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json({
            message: 'request body needed'
        })
    }

    const newProduct = new Product(body)

    try {
        await newProduct.save()
        
        //push a the new product to Spot document
        const spotDocument = await Spot.findById(body.spot)
        if (!spotDocument) {
            return res.status(400).json({
                message: 'spot does not exist'
            })
        }
        spotDocument.products.push(newProduct)
        await spotDocument.save()

        res.json({
            user: newProduct
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const productGet = async (req, res = response) => {
    const { spotId } = req.query

    const filter = {
        isEnabled: true,
        spot: spotId
    }
   
    try {
        const [ products, count ] = await Promise.all([
            Product.find(filter)
            .populate({
                path: 'availabilities',
                match: {isEnabled: true}
            }),
            Product.countDocuments(filter)
        ])
        
        res.json({
            count, products
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const productUpdate = async (req, res = response) => {
    const id = req.params.id
    const body = req.body

    const {user, _id, createdAt, isEnabled, ... updates} = body

    const options = {
        new: true
    }

    try {
        const productUpdated = await Product.findByIdAndUpdate(id, updates, options)
        if (!productUpdated) {
            return res.status(400).json({
                message: 'could not update product'
            })
        }
        res.json(productUpdated)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const productDelete = async (req, res = response) => {
    const id = req.params.id

    const options = {
        new: true
    }

    try {
        const deletedProduct = await Product.findByIdAndDelete(id, options)
        if (!deletedProduct) {
            return res.status(400).json({
                message: 'could not delete product'
            })
        }
        res.json(deletedProduct)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { productCreate, productGet, productDelete, productUpdate }