const { Router } = require('express')
const router = Router()
const PaymentService = require('../Services/payment_service')
const PaymentController = require('../Controller/payment_controller')
const payment = new PaymentController( new PaymentService() )

router.get('/payment', (req, res) => {
    payment.getPaymentLink(req, res)
})

router.get('/subscription', (req, res) => {
    payment.getSubscriptionLink(req, res)
})

module.exports = router