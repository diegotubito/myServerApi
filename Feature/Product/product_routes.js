const {Router} = require('express')
const { productCreate, productGet, productUpdate, productDelete } = require('./product_controller')
const router = Router()

router.post('/product', productCreate)
router.get('/product/:userId', productGet)
router.put('/product/:id', productUpdate)
router.delete('/product/:id', productDelete)

module.exports = router