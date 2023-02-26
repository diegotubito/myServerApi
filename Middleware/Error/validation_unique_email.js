const User = require('../../Model/user_model')

const checkUniqueEmail = async (email = '') => {
    const isUser = await User.findOne({email: email})
    if (isUser) {
        throw new Error('el email ya exsite')
    }
}

module.exports = checkUniqueEmail