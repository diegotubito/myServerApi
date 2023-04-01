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
            title: "pruebita title",
            currency_id: 'ARS',
            picture_url: "",
            description: "pruebita",
            category_id: 'art',
            quantity: 1,
            unit_price: 29
        }],
        back_urls: {
            success: 'http://127.0.0.1:3000',
            failure: '',
            pending: '',
        },
        payer: {
            email: "diegodavid12@icloud.com",
            identification: {
                type: 'DNI',
                number: '123456789'
            },  
            address: {
                street_name: "Av Caseros",
                street_number: 7304,
                zip_code: "52"
            }
        },
  //      auto_return: 'approved',
      //  binary_mode: true, // pagos solo tarjeta
    }

    try {
        const payment = await mercadopago.preferences.create(preference)
        res.json(payment)
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

module.exports = { paymentPost }