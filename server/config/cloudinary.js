const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = async () => {
    try {
        await cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET
        });
        console.log('Cloudinary configured successfully');
    } catch (err) {
        console.error('Error configuring Cloudinary:', err.message);
        throw err; // Propagate the error
    }
};
