const { response } = require("express")
const User = require('../Model/user_model')
const bcrypt = require('bcrypt')

const userGet = async (req, res = response) => {
    try {
        const users = await User.find({})
        res.json(users)        
    } catch (error) {
        res.status(500).json(error)
    }
}

const userPost = async (req, res = response) => {
    const body = req.body

    //setup password
    const saltRounds = 10
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(body.password, salt);
    body.password = hash
  
    const user = User(body)
    try {
        const newUser = await user.save()
        res.json(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

const userDelete = async (req, res = response) => {
    const _id = req.query._id
    try {
        const user = await User.deleteOne({_id})
        res.json(user)        
    } catch (error) {
        res.status(500).json(error)
    }
}

const userUpdate = async (req, res = response) => {
    const body = req.body
    const _id = req.body._id

    try {
        const updated = await User.updateOne({_id}, body)
        res.json(updated)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { userGet, userPost, userUpdate, userDelete }