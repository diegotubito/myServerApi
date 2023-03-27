const { response } = require('express')
const mercadopago = require('mercadopago')
mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN_MP
})

const paymentPost = async (req, res = response) => {
    const body = req.body

    let preference = {
        items: [{
            id: 123,
            title: body.title,
            currency_id: 'ARS',
            picture_url: body.picture_url,
            description: body.description,
            category_id: 'art',
            quantity: 1,
            unit_price: body.unit_price
        }],
        back_urls: {
            success: 'http://localhost:3000',
            failure: '',
            pending: '',
        },
        auto_return: 'approved',
        binary_mode: true, // pagos solo tarjeta
    }

    try {
        const payment = await mercadopago.preferences.create(preference)
        res.json(payment)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { paymentPost }