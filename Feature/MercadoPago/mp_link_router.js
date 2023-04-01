const { Router } = require('express')
const router = Router()
const { paymentLinkPost, subscriptionLinkPost, paymentMethodGet } = require('./mp_controller')

router.post('/payment', paymentLinkPost)
router.post('/subscription', subscriptionLinkPost)
router.get('/payment-methods', paymentMethodGet)

module.exports = router