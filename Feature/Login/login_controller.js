const { response } = require("express");
const User = require('../User/user_model')
const bcrypt = require('bcrypt')
const jwtoken = require('jsonwebtoken')

const loginPost = async (req, res = response) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({
                message: 'user does not exist.'
            })
        }

        if (!user.isEnabled) {
            return res.status(400).json({
                message: 'user deactivated.'
            })
        }

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(400).json({
                message: 'incorrect password.'
            })
        }

        const {_id} = user
        const token = jwtoken.sign({ _id: _id }, process.env.PUBLIC_SECRET_KEY, { expiresIn: 60 * 60 });

        res.json({
            user,
            token
        })    
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {loginPost }