const { response } = require("express")
const User = require('./user_model')
const bcrypt = require('bcrypt')

const userGet = async (req, res = response) => {
    try {
       // const users = await User.find()
       // const count = await User.countDocuments()
        
        // Due to User.countDocuments() doesn't need to wait for User.find() result.
        // I can perform the upper operations concurrently
        // in this way, we improve response time performance.
        const filter = {
            isEnabled: true
        }
        const [users, count] = await Promise.all([
            User.find(filter),
            User.countDocuments(filter)
        ])
       
        res.json({count, users})        
    } catch (error) {
        res.status(500).json(error)
    }
}

const userPost = async (req, res = response) => {
    const {createdAt, emailVerified, ...body} = req.body

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
    const _id = req.params._id
    
    try {
        const user = await User.deleteOne({_id})
        res.json(user)        
    } catch (error) {
        res.status(500).json(error)
    }
}

const userUpdate = async (req, res = response) => {
    const body = req.body
    const id = req.params._id

    const { email, createdAt, _id, password, ... filterBody } = body
    try {
        const updated = await User.updateOne({_id: id}, filterBody)
        res.json(updated)
    } catch (error) {
        res.status(500).json(error)
    }
}

module.exports = { userGet, userPost, userUpdate, userDelete }