const { request } = require('express');

function sendNotification(req = request, deviceTokens, alert, payload) {
    // Prepare and send push notifications
    if (deviceTokens.lenght == 0) {
        return
    }
    var note = new req.app.remoteNotification.apn.Notification();

    note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
    note.badge = 1;
    note.sound = "ping.aiff";
    note.alert = alert
    note.payload = payload
    note.topic = "appointmentInternal";

    const filteredArray = deviceTokens.filter(n => n)
   
    req.app.remoteNotification.apnProvider.send(note, filteredArray).then(result => {
        // Notification sent successfully
        console.log(result);
    }).catch(error => {
        // Error occurred while sending the notification
        console.error(error);
    });
}

module.exports = {sendNotification}