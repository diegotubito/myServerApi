const { Router } = require('express')
const { loginPost } = require('./login_controller')
const router = Router()

router.post('/login', loginPost)

module.exports = router