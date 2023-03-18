const { response } = require("express");
const User = require('../Model/user_model')
const bcrypt = require('bcrypt')
const jwtoken = require('jsonwebtoken')

const loginPost = async (req, res = response) => {
    const {email, password} = req.body

    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json('user does not exist')
        }

        const isValid = bcrypt.compareSync(password, user.password)
        if (!isValid) {
            return res.status(400).json('password incorrect')
        }

        const {uid} = user
        const token = jwtoken.sign({ data: uid }, process.env.PUBLIC_SECRET_KEY, { expiresIn: '1h' });

        res.json({
            user,
            token
        })    
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = {loginPost }