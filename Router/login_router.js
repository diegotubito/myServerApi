const { Router } = require('express')
const { loginPost } = require('../Controller/login_controller')
const router = Router()

router.post('/login', loginPost)

module.exports = router