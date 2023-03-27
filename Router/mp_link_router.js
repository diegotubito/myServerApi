const { Router } = require('express')
const router = Router()
const { paymentLinkPost, subscriptionLinkPost } = require('../Controller/mp_controller')

router.post('/payment', paymentLinkPost)
router.post('/subscription', subscriptionLinkPost)

module.exports = router