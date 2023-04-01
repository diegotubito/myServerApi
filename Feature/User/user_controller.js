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
        res.json(userUpdated)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })   
    }
}

const userNear = async (req, res = response) => {
    const coordinates = req.body.coordinates
    const distance = Number(req.body.distance)

    if (!coordinates || !distance) {
        return res.status(400).json({
            message: 'request error'
        }) 
    }
   
    const query = {
        isEnabled: true,
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: coordinates
                },
                $maxDistance: distance
            }
        }
    };

    // counts doesn't work with this kind or $near query
    try {
        const nearUsers = await User.find(query)
        res.json({
            users: nearUsers
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        }) 
    }
}

module.exports = { userGet, userPost, userUpdate, userDelete, userDeactivate, userActivate, userNear }