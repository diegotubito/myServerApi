const { request } = require('express');

function sendNotification(req = request, deviceTokens) {
    // Prepare and send push notifications
    if (deviceTokens.lenght == 0) {
        return
    }
    var note = new req.app.apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 3;
    note.sound = "ping.aiff";
    note.alert = "\uD83D\uDCE7 \u2709 You have a new message";
    note.payload = { 'messageFrom': 'John Appleseed' };
    note.topic = "appointmentInternal";

    const filteredArray = deviceTokens.filter(n => n)
    console.log('list of filter device tokens', deviceTokens)
   
    req.app.apnProvider.send(note, filteredArray).then(result => {
        // Notification sent successfully
        console.log('sending notification: success');
        console.log(result);
    }).catch(error => {
        // Error occurred while sending the notification
        console.log('sending notification: error');
        console.error(error);
    });


}

module.exports = {sendNotification}