const { response } = require("express")

const userGet = (req, res = response) => {
    res.send('Get request')
}

const userPost = (req, res = response) => {
    res.send('Post request')
}

const userDelete = (req, res = response) => {
    res.send('Delete request')
}

const userUpdate = (req, res = response) => {
    res.send('Update request')
}

module.exports = { userGet, userPost, userUpdate, userDelete }