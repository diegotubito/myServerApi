const User = require('../../Model/user_model')

const checkUniqueEmail = async (req, res, next) => {
     //check if user exist
     const body = req.body
     const isUser = await User.findOne({email: body.email})
     if (isUser) {
        return res.status(400).json('Email already exists')
     }

     next()
}

module.exports = checkUniqueEmail