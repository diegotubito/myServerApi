const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete} = require('../Controller/user_controller')

router.get('/user', userGet)
router.post('/user', userPost)
router.put('/user', userUpdate)
router.delete('/user', userDelete)

module.exports = router