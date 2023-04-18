const axios = require('axios');

const getImage = async (req, res) => {
    const imageURL = req.body.url

    try {
        const response = await axios({
            method: 'get',
            url: imageURL,
            responseType: 'stream'
        });

        // Set the appropriate content-type header for the image
        res.setHeader('Content-Type', response.headers['content-type']);

        // Pipe the image stream directly to the client
        response.data.pipe(res);
    } catch (error) {
        console.error('Error downloading the image:', error);
        res.status(500).send('Error downloading the image');
    }
}

module.exports = { getImage }
