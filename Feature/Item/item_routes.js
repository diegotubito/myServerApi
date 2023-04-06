const {Router} = require('express')
const { createItem, getItem, updateItem, deleteItem, getNearItems } = require('./item_controller')
const router = Router()

router.post('/item', createItem)
router.get('/item', getItem)
router.put('/item/:id', updateItem)
router.delete('/item/:id', deleteItem)

module.exports = router