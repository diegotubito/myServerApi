const {Router} = require('express')
const { createItem, getItem, updateItem, deleteItem, getNearItems } = require('./item_controller')
const validateToken = require('../../Middleware/Validation/validate_token')
const validateRole = require('../../Middleware/Validation/validate_role')
const router = Router()

router.post('/item',[
    validateToken,
    validateRole('SUPER_ROLE', 'OWNER_ROLE', 'ADMIN_ROLE')
], createItem)
router.get('/item', getItem)
router.put('/item/:id', updateItem)
router.delete('/item/:id', deleteItem)

module.exports = router