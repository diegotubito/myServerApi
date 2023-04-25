const { response } = require("express");
const Assignment = require('./assignment_model')
const User = require('../User/user_model')
const Availability = require('../Availability/availability_model')
const { parse } = require('date-fns');

const mongoose = require('mongoose')

const createAssignment = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json('bad request')
    }

    const dateString = body.startDateAndTime;
    const formatPattern = 'MM/dd/yyyy';
    const parsedDate = parse(dateString, formatPattern, new Date());

    const newBody = {
        ...body,
        startDateAndTime: parsedDate
    }

    const existingAssignment = await Assignment.findOne({
        availability: newBody.availability,
        startDate: newBody.startDate,
        spot: newBody.spot,
        status: 'user-scheduled'
    });

    if (existingAssignment) {
        return res.status(400).json({
            message: "An assignment with the same availability, startDate, and spot with scheduled status, already exists.",
        });
    }

    const assignment = Assignment(newBody)
    
    try {
        const newAssignment = await assignment.save()
        res.json({
            assignment: newAssignment
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message
        })
    }
}

const getAssignment = async (req, res = response) => {
    const { from, to, spotId } = req.query

    if (!from || !to || !spotId) {
        return res.status(400).json('bad request')
    }

    const formatPattern = 'MM/dd/yyyy\'T\'HH:mm:ss';
    const fromParsed = parse(from, formatPattern, new Date());
    const toParsed = parse(to, formatPattern, new Date());

    if (!fromParsed || !toParsed ) {
        return res.status(400).json('bad date format')
    }

    const query = {
        spot: spotId,
        startDateAndTime: {
            $gte: fromParsed,
            $lte: toParsed
        }
    }

    try {
        const [assignments, count] = await Promise.all([
            await Assignment.find(query)
            .populate('availability')
            .populate('user'),
            await Assignment.countDocuments(query)
        ])

        res.json({
            count,
            assignments
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const deleteAssignment = async (req, res = response) => {
    const {_id} = req.params

    try {
        const deletedDocument = await Assignment.findByIdAndDelete(_id)
        if (!deletedDocument) {
            return res.status(400).json({
                message: 'could not delete assignment'
            }) 
        }
        res.json(deletedDocument)
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })          
    }
}

const updateAssignment = async (req, res = response) => {
    const id = req.params._id 
    const {_id, service, user, availability, spot, amount, ...body} = req.body

    const formatPattern = 'MM/dd/yyyy\'T\'HH:mm:ss';
    const startDateAndTimeParsed = parse(body.startDateAndTime, formatPattern, new Date());

    if (!startDateAndTimeParsed) {
        return res.status(400).json('bad request: date format')
    }

    body.startDateAndTime = startDateAndTimeParsed

    const options = {
        new: true
    }

    try {
        const updatedDocument = await Assignment.findByIdAndUpdate(id, body, options)
        if (!updatedDocument) {
            return res.status(400).json({
                message: 'could not update assignment'
            }) 
        }
        res.json(updatedDocument)
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })  
    }
}

const acceptAssignment = async (req, res = response) => {
    const { _id } = req.params

    if (!_id) {
        return res.status(400).json('bad request: _id missging')
    }

    const options = {
        new: true
    }

    const updateValues = {
        status: 'owner-accepted'
    }

    try {
        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
        if (!updated) {
            return res.status(400).json('bad request')
        }
        res.json(updated)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const rejectAssignment = async (req, res = response) => {
    const { _id } = req.params

    if (!_id) {
        return res.status(400).json('bad request: _id missging')
    }

    const options = {
        new: true
    }

    const updateValues = {
        status: 'owner-rejected'
    }

    try {
        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
        if (!updated) {
            return res.status(400).json('bad request')
        }
        res.json(updated)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const scheduleAssignment = async (req, res = response) => {
    const { _id } = req.params

    if (!_id) {
        return res.status(400).json('bad request: _id missging')
    }

    const options = {
        new: true
    }

    const updateValues = {
        status: 'user-scheduled'
    }

    try {
        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
        if (!updated) {
            return res.status(400).json('bad request')
        }
        res.json(updated)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const cancelAssignment = async (req, res = response) => {
    const { _id } = req.params

    if (!_id) {
        return res.status(400).json('bad request: _id missging')
    }

    const options = {
        new: true
    }

    const updateValues = {
        status: 'user-cancelled'
    }

    try {
        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
        if (!updated) {
            return res.status(400).json('bad request')
        }
        res.json(updated)

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = { createAssignment, getAssignment, updateAssignment, deleteAssignment,
acceptAssignment, rejectAssignment, scheduleAssignment, cancelAssignment}