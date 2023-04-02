const { response } = require("express")
const User = require('./user_model')
const Spot = require('../Spot/spot_model')
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
            User.find(filter)
            .populate('spot'),
            User.countDocuments(filter)
        ])
       
        res.json({count, users})        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
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
        return res.status(500).json({
            message: error.message
        })
    }
}

const userDelete = async (req, res = response) => {
    const _id = req.params._id
    
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(400).json({
                message: 'could not delete'
            })
        }
        res.json(user)        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const userUpdate = async (req, res = response) => {
    const body = req.body
    const id = req.params._id

    const { email,
        spot,
         createdAt,
          _id,
          password,
           username,
           isEnabled,
            role,
             emailVerified, ... filterBody } = body

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const updated = await User.findByIdAndUpdate(id, filterBody, options)
        if (!updated) {
            return res.status(400).json({
                message: 'could not update'
            })
        }
        res.json(updated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const userDeactivate = async (req, res = response) => {
    const _id = req.params._id
    const query = {
        isEnabled: false
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(_id, query, options)
        if (!userUpdated) {
            return res.status(400).json({
                message: 'could not deactivate'
            })
        }
        res.json(userUpdated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })    
    }
}

const userActivate = async (req, res = response) => {
    const _id = req.params._id
    const query = {
        isEnabled: true
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(_id, query, options)
        if (!userUpdated) {
            return res.status(400).json({
                message: 'could not activate'
            })
        }
        res.json(userUpdated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })   
    }
}

const asignSpotToUser = async (req, res = response) => {
    const { _id } = req.params
    const { spotId } = req.body

    const changes = {
        spot: spotId
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(_id, changes, options)
        if (!userUpdated) {
            return res.status(400).json({
                message: 'could not update'
            })
        }

        res.json(userUpdated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })   
    }
}

const removeSpotToUser = async (req, res = response) => {
    const { _id } = req.params
    
    const changes = {
        spot: null
    }

    const options = {
        new: true, // return new document instead of previous one.
    }

    try {
        const userUpdated = await User.findByIdAndUpdate(_id, changes, options)
        if (!userUpdated) {
            return res.status(400).json({
                message: 'could not update'
            })
        }
        res.json(userUpdated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })   
    }
}


module.exports = { userGet, userPost, userUpdate, userDelete, userDeactivate, userActivate, removeSpotToUser, asignSpotToUser }