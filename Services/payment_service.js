const axios = require("axios")

class PaymentService {

    async createPayment(body) {
        const url = "https://api.mercadopago.com/checkout/preferences";

        const mpBody = {
            payer_email: body.payer_email, // aca va mi email comprador
            items: [
                {
                    title: body.title,
                    description: body.description,
                    picture_url: body.picture_url,
                    category_id: "category123",
                    quantity: body.quantity,
                    unit_price: body.unit_price
                }
            ],
            back_urls: {
                failure: "/failure",
                pending: "/pending",
                success: "/success"
            }
        }

        const payment = await axios.post(url, mpBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })

        return payment.data
    }

    async createSubscription(body) {
        const url = "https://api.mercadopago.com/preapproval"

        const mpBody = {
            reason: body.reason,
            auto_recurring: {
                frequency: body.frequency, 
                frequency_type: "months",
                transaction_amount: 10,
                currency_id: "ARS"
            },
            back_url: body.back_url,
            payer_email: body.payer_email // va el email comprador
        }

        const subscription = await axios.post(url, mpBody, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })

        return subscription.data
    }

    async getPaymentMethods() {
        const url = "https://api.mercadopago.com/v1/payment_methods"

        const paymentMethods = await axios.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`
            }
        })

        return paymentMethods.data
    }
}

module.exports = PaymentService