const {Router} = require('express')
const { paymentPost } = require('../Controller/mp_sdk_controller')
const router = Router()

router.post('/payment', paymentPost)

module.exports = router