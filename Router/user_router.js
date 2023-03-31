const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete} = require('../Controller/user_controller')
const {check} = require('express-validator')
const checkValidationResult = require('../Middleware/Error/validation_error')
const checkUniqueEmail = require('../Middleware/Error/validation_unique_email')
const validateToken = require('../Middleware/Error/validate_token')
const validateUniqueUsername = require('../Middleware/Error/validate_unique_username')

router.get('/user', userGet)
router.post('/user', [
    check('username', 'username is too short or too long').isLength({min: 2, max: 30}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password format is wrong').isLength({min:4}),
    check('email', 'email must be unique').custom(checkUniqueEmail),
    check('username', 'username must be unique').custom(validateUniqueUsername),
    checkValidationResult,
], userPost)
router.put('/user/:_id', userUpdate)
router.delete('/user/:_id', userDelete)

module.exports = router