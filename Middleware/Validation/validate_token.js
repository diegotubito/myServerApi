const { response, request } = require("express");
const jwt = require('jsonwebtoken')
const User = require('../../Feature/User/user_model')

const validateToken = async (req = request, res = response, next) => {
    const {authorization} = req.headers

    jwt.verify(authorization, process.env.PUBLIC_SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.status(401).json({
                name: error.name,
                message: error.message
            })
        }

        if (!decoded._id) {
            return res.status(401).json({
                name: "TokenExpiredError",
                message: "jwt not valid"
            })
        }

        try {
            const user = await User.findOne({_id: decoded._id})
            if (!user.isEnabled) {
                return res.status(403).json({
                    message: 'authorization denied. User deactivated.'
                })
            }
            req.user = user
            next()
    
        } catch (error) {
            return res.status(403).json({
                message: error.message
            })
        }

    })
}

module.exports = validateToken