const { Router } = require('express')
const { createAssignment, getAssignment, updateAssignment, deleteAssignment} = require('./assigment_controller')
const router = Router()

router.post('/assignment', createAssignment)
router.get('/assignment', getAssignment)
router.put('/assignment/:_id', updateAssignment)
router.delete('/assignment/:_id', deleteAssignment)

module.exports = router