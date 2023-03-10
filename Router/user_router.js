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
    check('email', 'email must be unique').custom(checkUniqueEmail),
    checkValidationResult,
], userPost)
router.put('/user/:id', [
    check('displayName', 'el mismo que el anterior').isLength({min: 2, max: 30}),
    check('email', 'no es email').isEmail(),
    check('email', 'el email es repetido').custom(checkUniqueEmail),
    checkValidationResult
], userUpdate)
router.delete('/user/:_id', userDelete)

module.exports = router