const { parse } = require('date-fns');
function parseTime(timeString) {
    const format = 'HH:mm'; // or 'HH:mm:ss' if you include seconds
    const referenceDate = new Date(2000, 0, 1); // use a reference date, I only care about time.
    const parsedTime = parse(timeString, format, referenceDate);
    return parsedTime;
}

module.exports = { parseTime }