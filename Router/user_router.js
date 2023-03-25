const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete} = require('../Controller/user_controller')
const {check} = require('express-validator')
const checkValidationResult = require('../Middleware/Error/validation_error')
const checkUniqueEmail = require('../Middleware/Error/validation_unique_email')
const validateToken = require('../Middleware/Error/validate_token')

router.get('/user', [
    validateToken
], userGet)
router.post('/user', [
    validateToken,
    check('displayName', 'Display name is too short or too long').isLength({min: 2, max: 30}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password format is wrong').isLength({min:4}),
    check('email', 'email must be unique').custom(checkUniqueEmail),
    checkValidationResult,
], userPost)
router.put('/user/:_id', [
    validateToken
], userUpdate)
router.delete('/user/:_id', [
    validateToken
], userDelete)

module.exports = router