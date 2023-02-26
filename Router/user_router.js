const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete} = require('../Controller/user_controller')
const {check} = require('express-validator')
const checkValidationResult = require('../Middleware/Error/validation_error')
const checkUniqueEmail = require('../Middleware/Error/validation_unique_email')

router.get('/user', userGet)
router.post('/user', [
    check('displayName', 'Display name is too short or too long').isLength({min: 2, max: 30}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password format is wrong').isLength({min:4}),
    checkValidationResult,
    checkUniqueEmail,
], userPost)
router.put('/user', userUpdate)
router.delete('/user', userDelete)

module.exports = router