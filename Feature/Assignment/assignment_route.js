const { Router } = require('express')
const { createAssignment,
     getAssignment,
      updateAssignment,
       deleteAssignment,
        acceptAssignment,
         rejectAssignment,
          scheduleAssignment,
           cancelAssignment, 
           deleteAllAssignment,
           getPastAssignment,
           getFutureAssignment} = require('./assigment_controller')
const router = Router()

router.post('/assignment', createAssignment)
router.get('/assignment', getAssignment)
router.get('/assignment-past', getPastAssignment)
router.get('/assignment-future', getFutureAssignment)
router.put('/assignment/:_id', updateAssignment)
router.delete('/assignment/:_id', deleteAssignment)
router.delete('/assignment-all', deleteAllAssignment)

router.post('/assignment/accept/:_id', acceptAssignment)
router.post('/assignment/reject/:_id', rejectAssignment)
router.post('/assignment/schedule/:_id', scheduleAssignment)
router.post('/assignment/cancel/:_id', cancelAssignment)

module.exports = router