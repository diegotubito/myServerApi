const { response, json } = require("express");
const Assignment = require('./assignment_model')
const User = require('../User/user_model')
const Availability = require('../Availability/availability_model')
const { parse } = require('date-fns');
const { isLowerThanToday } = require('../../Common/date_helper')
const { emit, sendUpdateNeedEmitter } = require('../../Common/socket_helper')
const { sendNotification } = require('../../Common/notification_helper')

const mongoose = require('mongoose');
const { deleteTimer } = require("../../Common/timer_helper");



const createAssignment = async (req, res = response) => {
    const body = req.body
    if (!body) {
        return res.status(400).json('bad request')
    }
    try {
        const startDate = new Date(body.startDate)
        /*
        if (isLowerThanToday(startDate)) {
            return res.status(400).json({
                title: "Assignment error",
                message: "date must be greater than today."
            })
        }
        */
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
        const loadAssignment = await Assignment.findById(newAssignment._id)
        .populate({
            path: 'user',
            populate: {
                path: 'spot',
                populate: 'tipos'
            }
        })
        .populate({
            path: 'item',
            populate: {
                path: 'spot',
                populate: 'tipos'
            }
        })
        const clientId = loadAssignment.user._id.toString()
        const sourceId = loadAssignment.item.spot._id.toString()
        sendUpdateNeedEmitter(req, [sourceId, clientId])
        sendNotificationToSpot(req, sourceId, "New appointment created.", "A new request has been created.")

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

async function sendNotificationToSpot(req = request, id, title, body) {
        // send notification to spot users
        const user = await User.findOne({spot: id})
        const payload = {
            user
        }
        const alert = {
            title: title,  // Title for the notification
            body: body,  // Body text
        }
        sendNotification(req, user.deviceTokens, alert, payload)
}

const getAllAssignmentByUser = async (req, res = response) => {
    const { userId } = req.query

    if (!userId) {
        return res.status(400).json('bad request')
    }

    const query = {
        user: userId
    }

    try {
        const [assignments, count] = await Promise.all([
            await Assignment.find(query)
                .populate('availability')
                .populate('item')
                .populate({
                    path: 'user',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
                    }
                })
                .populate({
                    path: 'item',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
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


const getAllAssignment = async (req, res = response) => {
    const { spotId } = req.query

    if (!spotId) {
        return res.status(400).json('bad request')
    }

    const query = {
        spot: spotId
    }

    try {
        const [assignments, count] = await Promise.all([
            await Assignment.find(query)
                .populate('availability')
                .populate('item')
                .populate({
                    path: 'user',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
                    }
                })
                .populate({
                    path: 'item',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
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

const getAssignment = async (req, res = response) => {
    const { from, to, spotId } = req.query

    if (!from || !to || !spotId) {
        return res.status(400).json('bad request')
    }

    const fromParsed = new Date(from)
    const toParsed = new Date(to)

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
                .populate({
                    path: 'user',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
                    }
                })
                .populate({
                    path: 'item',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
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

const getPastAssignment = async (req, res = response) => {
    const { from, spotId } = req.query

    if (!from || !spotId) {
        return res.status(400).json('bad request')
    }

    const fromParsed = new Date(from)

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
                    path: 'item',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
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

    const fromParsed = new Date(from);

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
                    path: 'item',
                    populate: {
                        path: 'spot',
                        populate: 'tipos'
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

    const startDateAndTimeParsed = new Date(body.startDateAndTime);

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
    const { startDate, assignmentId, availabilityId } = req.body
    if (!startDate || !assignmentId || !availabilityId) {
        return res.status(400).json('bad request: _id missging')
    }

    try {
        const startDateConverted = new Date(startDate)

        const repeatedAssignments = await Assignment.aggregate([
            {
                $lookup: {
                    from: 'availabilities', // the name of the Availability collection
                    localField: 'availability',
                    foreignField: '_id',
                    as: 'availability'
                },
            },
            {
                $unwind: {
                    path: "$availability",
                },
            },
            {
                $match: {
                    "availability._id": mongoose.Types.ObjectId(availabilityId),
                    "startDate": startDateConverted,
                    "status": { $in: ["user-scheduled", "owner-accepted"] }
                }
            }
        ])

        if (repeatedAssignments.length > 0) {
            return res.status(432).json({
                title: 'Overlapping date and time',
                message: 'Time slot is no longer available. Do not reject it. Wait until the user schedule.'
            })
        }

        const options = {
            new: true
        }

        const expirationDate = {
            duration: 1,
            startDate: Date()
        }

        const updateValues = {
            status: 'owner-accepted',
            expiration: expirationDate
        }

        const updated = await Assignment.findByIdAndUpdate(assignmentId, updateValues, options)
            .populate('availability')
            .populate({
                path: 'user',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })
            .populate({
                path: 'item',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })

        if (!updated) {
            return res.status(400).json('bad request')
        }

        const timer = setTimeout(async () => {
            const assignment = await Assignment.findById(updated._id);
            if (!assignment) {
                // there's no res, because this is something exceptional
                return
            }
            if (assignment.status === 'owner-accepted') {
                const newStatus = {
                    status: 'owner-expired'
                }
                await Assignment.findByIdAndUpdate(assignmentId, newStatus, options)
                deleteTimer(req, updated._id)
                const clientId = updated.user._id.toString()
                const sourceId = updated.item.spot._id.toString()
                sendUpdateNeedEmitter(req, [sourceId, clientId])
            } else {
                deleteTimer(req, updated._id)
            }
        }, updated.expiration.duration * 60 * 1000);

        req.app.timers[updated._id] = timer
        console.log('adding', req.app.timers)

        const clientId = updated.user._id.toString()
        const sourceId = updated.item.spot._id.toString()
        sendUpdateNeedEmitter(req, [sourceId, clientId])
       
        const payload = {
            updated
        }
        const alert = {
            title: "Appointment Accepted",  // Title for the notification
            body: "You have 5 minutes to schedule your appointment.",  // Body text
        }
        sendNotification(req, updated.user.deviceTokens, alert, payload)
       
        res.json({
            assignment: updated
        })
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
            .populate('availability')
            .populate({
                path: 'user',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })
            .populate({
                path: 'item',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })

        if (!updated) {
            return res.status(400).json('bad request')
        }

        const clientId = updated.user._id.toString()
        const sourceId = updated.item.spot._id.toString()
        sendUpdateNeedEmitter(req, [sourceId, clientId])

        const payload = {
            updated
        }
        const alert = {
            title: "Appointment Rejected",  // Title for the notification
            body: "The owner has rejected your assignment.",  // Body text
        }
        sendNotification(req, updated.user.deviceTokens, alert, payload)

        res.json({
            assignment: updated
        })

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
        const assignment = await Assignment.findById(_id)
        if (assignment.status != 'owner-accepted') {
            return res.status(432).json({
                title: 'Status Error',
                message: 'Schedule not allowed at this moment.'
            })
        }
        const expiration = assignment.expiration
        if (expiration != null) {
            const startDate = new Date(expiration.startDate);
            const durationInMinutes = expiration.duration;
            const expirationTime = new Date(startDate.getTime() + durationInMinutes * 60000);
            const currentTime = new Date();

            if (currentTime > expirationTime) {
                return res.status(432).json({
                    title: 'Expiration',
                    message: 'the assignment has expired.'
                })
            }
        }

        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
            .populate('availability')
            .populate({
                path: 'user',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })
            .populate({
                path: 'item',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })


        if (!updated) {
            return res.status(400).json('bad request')
        }

        deleteTimer(req, updated._id)

        const clientId = updated.user._id.toString()
        const sourceId = updated.item.spot._id.toString()
        sendUpdateNeedEmitter(req, [sourceId, clientId])
        sendNotificationToSpot(req, sourceId, "Congratulations", "The user created an appointment.")

        res.json({
            assignment: updated
        })

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

        const assignment = await Assignment.findById(_id)
        if (assignment.status != 'owner-accepted') {
            return res.status(432).json({
                title: 'Status Error',
                message: 'Cancel not allowed at this moment.'
            })
        }
        const expiration = assignment.expiration
        if (expiration != null) {
            const startDate = new Date(expiration.startDate);
            const durationInMinutes = expiration.duration;
            const expirationTime = new Date(startDate.getTime() + durationInMinutes * 60000);
            const currentTime = new Date();

            if (currentTime > expirationTime) {
                return res.status(432).json({
                    title: 'Expiration',
                    message: 'the assignment has expired.'
                })
            }
        }

        const updated = await Assignment.findByIdAndUpdate(_id, updateValues, options)
            .populate('availability')
            .populate({
                path: 'user',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })
            .populate({
                path: 'item',
                populate: {
                    path: 'spot',
                    populate: 'tipos'
                }
            })


        if (!updated) {
            return res.status(400).json('bad request')
        }

        deleteTimer(req, updated._id)

        const clientId = updated.user._id.toString()
        const sourceId = updated.item.spot._id.toString()
        sendUpdateNeedEmitter(req, [sourceId, clientId])
        sendNotificationToSpot(req, sourceId, "Ohh no!", "The user cancelled assignment.")

        res.json({
            assignment: updated
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

module.exports = {
    createAssignment, getAssignment, updateAssignment, deleteAssignment,
    acceptAssignment, rejectAssignment, scheduleAssignment, cancelAssignment,
    deleteAllAssignment, getPastAssignment, getFutureAssignment, getAllAssignment, getAllAssignmentByUser
}