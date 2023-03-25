const { response } = require("express");
const User = require('../Model/user_model')
const bcrypt = require('bcrypt')
const jwtoken = require('jsonwebtoken')

const loginPost = async (req, res = response) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email, isEnabled: true})
        if (!user) {
            return res.status(400).json('user does not exist')
        }

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(400).json('password incorrect')
        }

        const {_id} = user
        const token = jwtoken.sign({ _id: _id }, process.env.PUBLIC_SECRET_KEY, { expiresIn: 60 * 60 });

        res.json({
            user,
            token
        })    
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {loginPost }