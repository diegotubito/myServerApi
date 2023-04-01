const { response } = require("express")
const Product = require('./product_model')

const productCreate = async (req, res = response) => {
    const body = req.body
    if (!body) {
        res.status(400).json({
            message: 'request body needed'
        })
    }

    const newProduct = new Product(body)

    try {
        await newProduct.save()
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
    const query = {
        isEnabled: true,
        user: req.params.userId
    }

    try {
        const products = await Product.find(query)
        .populate('user')
        res.json({
            products
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
        res.json(productUpdated)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

const productDelete = async (req, res = response) => {
    const id = req.params.id

    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        res.json(deletedProduct)
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { productCreate, productGet, productDelete, productUpdate }