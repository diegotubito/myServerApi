
const Availability = require('./availability_model')

async function hasOverlappingAvailability(serviceId, newStartDate, newEndDate) {
    const overlappingAvailability = await Availability.findOne({
        service: serviceId,
        $or: [
            // Case 1: New availability is within an existing availability
            { startDate: { $lte: newStartDate }, endDate: { $gte: newEndDate } },
            // Case 2: New availability starts during an existing availability
            { startDate: { $lte: newStartDate }, endDate: { $gt: newStartDate, $lt: newEndDate } },
            // Case 3: New availability ends during an existing availability
            { startDate: { $gt: newStartDate, $lt: newEndDate }, endDate: { $gte: newEndDate } },
            // Case 4: New availability covers an existing availability
            { startDate: { $gte: newStartDate }, endDate: { $lte: newEndDate } },
        ],
    });

    return !!overlappingAvailability;
}

module.exports = { hasOverlappingAvailability }