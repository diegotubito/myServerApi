const { response } = require("express")

const validateRole = (...roles) => {

    return (req, res = response, next) => {
        const { role } = req.user

        if (!roles.includes(role)) {
            return res.status(401).json('no tiene el rol adecuado')
        }

        next()
    } 

}

module.exports = validateRole