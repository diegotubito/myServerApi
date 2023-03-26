const axios = require("axios")

class PaymentService {

    async createPayment() {
        const url = "https://api.mercadopago.com/checkout/preferences";

        const body = {
            payer_email: "test_user_1270583015@testuser.com", // aca va mi email comprador
            items: [
                {
                    title: "Dummy Title",
                    description: "Dymmy description",
                    picture_utl: "http://www.myapp.com/myimage.jpg",
                    category_id: "category123",
                    quantity: 1,
                    unit_price: 10
                }
            ],
            back_urls: {
                failure: "/failure",
                pending: "/pending",
                success: "/success"
            }
        }

        const payment = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })

        return payment.data
    }

    async createSubscription() {
        const url = "https://api.mercadopago.com/preapproval"

        const body = {
            reason: "Suscripción de ejemplo",
            auto_recurring: {
                frequency: 1, 
                frequency_type: "months",
                transaction_amount: 10,
                currency_id: "ARS"
            },
            back_url: "https://google.com.ar",
            payer_email: "test_user_1270583015@testuser.com" // va el email comprador
        }

        const subscription = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })

        return subscription.data
    }
}

module.exports = PaymentService