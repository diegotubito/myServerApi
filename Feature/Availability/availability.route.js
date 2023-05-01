const { Router } = require('express')
const router = Router()

const {getAvailabilities, createAvailability, updateAvailability, deleteAvailability, deleteAllAvailability} = require('./availability_controller')

router.get('/availability', getAvailabilities)
router.post('/availability', createAvailability)
router.put('/availability/:_id', updateAvailability)
router.delete('/availability/:_id', deleteAvailability)
router.delete('/availability-all', deleteAllAvailability)

module.exports = router