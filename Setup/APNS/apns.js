const apn = require('apn');

const privateKeyPath = './AuthKey_Y84TBQ8U54.p8'
const teamId = 'S2BEC8V882';
const keyId = 'Y84TBQ8U54';

// Create authentication options
const options = {
    token: {
      key: privateKeyPath,
      keyId: keyId,
      teamId: teamId,
    },
    production: false, // Set to true for production environment
};

class RemoteNotification {
    constructor() {
        this.apn = apn
        this.apnProvider = new apn.Provider(options);
    }
}

module.exports = RemoteNotification