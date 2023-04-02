const { Router } = require('express')
const router = Router()
const {userGet, userPost, userUpdate, userDelete, userDeactivate, userActivate, asignSpotToUser, removeSpotToUser } = require('./user_controller')
const {check} = require('express-validator')
const checkValidationResult = require('../../Middleware/Error/validation_error')
const checkUniqueEmail = require('../../Middleware/Validation/validation_unique_email')
const validateToken = require('../../Middleware/Validation/validate_token')
const validateUniqueUsername = require('../../Middleware/Validation/validate_unique_username')
const validateRole = require('../../Middleware/Validation/validate_role')
const validateExistingRole = require('../../Middleware/Validation/validate_existing_role')

router.get('/user',[
    validateToken,
    validateRole('SUPER_ROLE', 'ADMIN_ROLE')
], userGet)

router.post('/user', [
   // validateToken,
    check('username', 'username is too short or too long').isLength({min: 2, max: 30}),
    check('email', 'Email format is invalid').isEmail(),
    check('password', 'Password format is wrong').isLength({min:4}),
    check('email', 'email must be unique').custom(checkUniqueEmail),
    check('username', 'username must be unique').custom(validateUniqueUsername),
    check('role', 'row is not allowed').custom(validateExistingRole),
    checkValidationResult,
], userPost)

router.put('/user/:_id', [
    validateToken,
    validateRole('ALL'),
    check('firstName', 'firstName is too short or too long').isLength({min: 2, max: 30}),
    check('firstName', 'firstName must be alpha').isAlpha('en-US', {ignore: ' '}),
    check('lastName', 'lastName is too short or too long').isLength({min: 2, max: 30}),
    check('lastName', 'lastName must be alpha').isAlpha('en-US', {ignore: ' '}),
    checkValidationResult
], userUpdate)

router.delete('/user/:_id', [
    validateToken,
    validateRole('SUPER_ROLE')
], userDelete)

router.put('/user/deactivate/:_id', [
    validateToken,
    validateRole('SUPER_ROLE', 'ADMIN_ROLE')
], userDeactivate)

router.put('/user/activate/:_id', [
    validateToken,
    validateRole('SUPER_ROLE', 'ADMIN_ROLE')
], userActivate)

router.put('/user/asign-spot/:_id', asignSpotToUser)
router.put('/user/remove-spot/:_id', removeSpotToUser)

module.exports = router