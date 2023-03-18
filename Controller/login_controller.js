const { response } = require("express");

const loginPost = (req, res = response) => {
    res.json('login')
}

module.exports = {loginPost }