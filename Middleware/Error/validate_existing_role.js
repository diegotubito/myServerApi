const { response } = require("express");
const Role = require('../../Model/role_model')

const validateExistingRole = async (role = '') => {
    const query = {
        role: role
    }

    const existingRole = await Role.findOne(query)
    if ( !existingRole ) {
        throw new Error(`${role} is not valid role`)
    }
}

module.exports = validateExistingRole