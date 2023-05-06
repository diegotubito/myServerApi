const { response, json } = require("express");
const Assignment = require('./assignment_model')
const User = require('../User/user_model')
const Availability = require('../Availability/availability_model')
const { parse } = require('date-fns');
const { parseDateIgnoringTimeZone, isLowerThanToday } = require('../../Common/date_helper')

const mongoose = require('mongoose')

const createAssignment = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json('bad request')
    }
    try {
        const startDate = parseDateIgnoringTimeZone(body.startDate);
        if (isLowerThanToday(startDate)) {
            return res.status(400).json({
                title: "Assignment error",
                message: "date must be greater than today."
            })
        }
        const newBody = {
            ...body,
            startDate: startDate
        }
        const existingAssignment = await Assignment.findOne({
            availability: newBody.availability,
            startDate: startDate,
            spot: newBody.spot,
            status: 'user-scheduled'
        });
        if (existingAssignment) {
            return res.status(400).json({
                message: "Bad request. An assignment with the same availability, startDate, and spot with scheduled status, already exists.",
            });
        }
        const assignment = Assignment(newBody)
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

    const fromParsed = parseDateIgnoringTimeZone(from);
    const toParsed = parseDateIgnoringTimeZone(to);

    if (!fromParsed || !toParsed) {
        return res.status(400).json('bad date format')
    }

    const query = {
        spot: spotId,
        startDate: {
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

const getPastAssignment = async (req, res = response) => {
    const { from, spotId } = req.query

    if (!from || !spotId) {
        return res.status(400).json('bad request')
    }

    const fromParsed = parseDateIgnoringTimeZone(from);

    if (!fromParsed) {
        return res.status(400).json('bad date format')
    }

    const query = {
        spot: spotId,
        startDate: {
            $lte: fromParsed,
        }
    }

    try {
        const [assignments, count] = await Promise.all([
            await Assignment.find(query)
                .populate('availability')
                .populate({
                    path: 'user',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
                    }
                })
                .populate({
                    path: 'spot',
                    populate: {
                        path: 'tipos',
                        model: 'tipo'
                    }
                }),
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

const getFutureAssignment = async (req, res = response) => {
    const { from, spotId } = req.query

    if (!from || !spotId) {
        return res.status(400).json('bad request')
    }

    const fromParsed = parseDateIgnoringTimeZone(from);

    if (!fromParsed) {
        return res.status(400).json('bad date format')
    }

    const query = {
        spot: spotId,
        startDate: {
            $gte: fromParsed,
        }
    }

    try {
        const [assignments, count] = await Promise.all([
            await Assignment.find(query)
                .populate('availability')
                .populate({
                    path: 'user',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
                    }
                })
                .populate({
                    path: 'spot',
                    populate: {
                        path: 'tipos',
                        model: 'tipo'
                    }
                }),
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
    const { _id } = req.params

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

const deleteAllAssignment = async (req, res = response) => {
  
    try {
        const deletedDocument = await Assignment.deleteMany()
        res.json('success deleting all assignments')

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

const updateAssignment = async (req, res = response) => {
    const id = req.params._id
    const { _id, service, user, availability, spot, amount, ...body } = req.body

    const formatPattern = 'MM-dd-yyyy\'T\'HH:mm:ss';
    const startDateAndTimeParsed = parseDateIgnoringTimeZone(body.startDateAndTime, formatPattern);

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

module.exports = {
    createAssignment, getAssignment, updateAssignment, deleteAssignment,
    acceptAssignment, rejectAssignment, scheduleAssignment, cancelAssignment,
    deleteAllAssignment, getPastAssignment, getFutureAssignment
}