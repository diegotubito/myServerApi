const { response, request } = require("express");
const jwt = require('jsonwebtoken')
const User = require('../../Model/user_model')

const validateToken = async (req = request, res = response, next) => {
    const {authorization} = req.headers

    jwt.verify(authorization, process.env.PUBLIC_SECRET_KEY, async (error, decoded) => {
        if (error) {
            return res.status(401).json('invalid token')
        }

        if (!decoded._id) {
            return res.status(401).json('invalid token by id')
        }

        try {
            console.log(decoded._id)
            const user = await User.findOne({_id: decoded._id})
            console.log(user)
            if (!user.isEnabled) {
                return res.status(401).json('invalid token user not enabled')
            }
            req.user = user
            next()
    
        } catch (error) {
            return res.status(401).json('invalidad token, user error')
        }

    })
}

module.exports = validateToken