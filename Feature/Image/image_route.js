const Router = require('express')
const { getImage } = require('./image_controller')
const router = Router()

router.post('/image', getImage)

module.exports = router