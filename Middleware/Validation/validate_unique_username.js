const User = require('../../Feature/User/user_model')

const validateUniqueUsername = async (username = '') => {
    const query = {
        username: username
    }

    const user = await User.findOne(query)

    if (user) {
        throw new Error('username field must be unique')
    }

}

module.exports = validateUniqueUsername