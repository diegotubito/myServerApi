const { Router } = require('express')
const checkValidationResult = require('../../Middleware/Error/validation_error')
const { getSpot, createSpot, getNearSpot, deleteSpot, deactivateSpot, activateSpot, updateSpot } = require('./spot_controller')
const router = Router()

router.get('/spot', getSpot)
router.post('/spot', createSpot)
router.post('/near-spot', getNearSpot)
router.delete('/spot/:_id', deleteSpot)
router.put('/deactivate-spot/:_id', deactivateSpot)
router.put('/activate-spot/:_id', activateSpot)
router.put('/spot/:_id', updateSpot)

module.exports = router