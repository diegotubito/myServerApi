const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete} = require('./user_controller')
const {check} = require('express-validator')
const checkValidationResult = require('../../Middleware/Error/validation_error')
const checkUniqueEmail = require('../../Middleware/Error/validation_unique_email')
const validateToken = require('../../Middleware/Error/validate_token')
const validateUniqueUsername = require('../../Middleware/Error/validate_unique_username')
const validateRole = require('../../Middleware/Error/validate_role')
const validateExistingRole = require('../../Middleware/Error/validate_existing_role')

router.get('/user',[validateToken, validateRole('SUPER_ROLE', 'ADMIN_ROLE')], userGet)
router.post('/user', [
    validateToken,
    check('username', 'username is too short or too long').isLength({min: 2, max: 30}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password format is wrong').isLength({min:4}),
    check('email', 'email must be unique').custom(checkUniqueEmail),
    check('username', 'username must be unique').custom(validateUniqueUsername),
    check('role', 'row is not allowed').custom(validateExistingRole),
    checkValidationResult,
], userPost)
router.put('/user/:_id', userUpdate)
router.delete('/user/:_id', userDelete)

module.exports = router