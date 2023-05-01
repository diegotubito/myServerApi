const { parse } = require('date-fns');

function isLowerThanToday(startDate) {
    const today = new Date();
    const todayTimestamp = today.getTime();

    if (startDate.getTime() < todayTimestamp) {
        return true
    }
    return false
}

function parseTime(timeString) {
    if (!timeString) {
        console.error("Error parsing date: input string is empty or undefined");
        return null;
    }

    try {
         const [hour, minute, second] = timeString.split(':');
        const parsedDate = new Date(Date.UTC(
            parseInt(2000, 10),
            parseInt(1, 10) - 1,
            parseInt(1, 10),
            parseInt(hour, 10),
            parseInt(minute, 10),
            parseInt(second, 10)
        ));

        if (isNaN(parsedDate.valueOf())) {
            console.error("Error parsing date: resulting date is invalid", timeString);
            return null;
        }

        return parsedDate;
    } catch (error) {
        throw new Error("Error parsing date: " + error.message + " " + timeString);
    }
}

function parseDateIgnoringTimeZone(dateTimeString) {
    if (!dateTimeString) {
        console.error("Error parsing date: input string is empty or undefined");
        return null;
    }

    try {
        const [datePart, timePart] = dateTimeString.split('T');
        const [month, day, year] = datePart.split('/');
        const [hour, minute, second] = timePart.split(':');

        const parsedDate = new Date(Date.UTC(
            parseInt(year, 10),
            parseInt(month, 10) - 1,
            parseInt(day, 10),
            parseInt(hour, 10),
            parseInt(minute, 10),
            parseInt(second, 10)
        ));

        if (isNaN(parsedDate.valueOf())) {
            console.error("Error parsing date: resulting date is invalid", dateTimeString);
            return null;
        }

        return parsedDate;
    } catch (error) {
        throw new Error("Error parsing date: " + error.message + " " + dateTimeString);
    }
}


module.exports = { parseTime, parseDateIgnoringTimeZone, isLowerThanToday }