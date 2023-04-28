const { parse } = require('date-fns');

function parseTime(timeString) {
    const format = 'HH:mm:ss'; // or 'HH:mm:ss' if you include seconds
    const referenceDate = new Date(2000, 0, 1); // use a reference date, I only care about time.
    const parsedTime = parse(timeString, format, referenceDate);
    return parsedTime;
}

function parseDateIgnoringTimeZone(dateTimeString) {
    const [datePart, timePart] = dateTimeString.split('T');
    const [month, day, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    const parsedDate = new Date(Date.UTC(parseInt(year, 10),
     parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(hour, 10),
       parseInt(minute, 10),
        parseInt(second, 10)));

    return parsedDate;
}

module.exports = { parseTime, parseDateIgnoringTimeZone }