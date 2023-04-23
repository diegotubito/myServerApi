
const Availability = require('./availability_model')

async function hasOverlappingAvailability(serviceId, dayOfWeek, newStartTime, newEndTime) {
    const overlappingAvailability = await Availability.findOne({
    service: serviceId,
    dayOfWeek: dayOfWeek,
    $or: [
    // Case 1: New availability is within an existing availability
    { startTime: { $lte: newStartTime }, endTime: { $gte: newEndTime } },
    // Case 2: New availability starts during an existing availability
    { startTime: { $lte: newStartTime }, endTime: { $gt: newStartTime, $lt: newEndTime } },
    // Case 3: New availability ends during an existing availability
    { startTime: { $gt: newStartTime, $lt: newEndTime }, endTime: { $gte: newEndTime } },
    // Case 4: New availability covers an existing availability
    { startTime: { $gte: newStartTime }, endTime: { $lte: newEndTime } },
    ],
    });
    
    return !!overlappingAvailability;
}

module.exports = { hasOverlappingAvailability }