const cloudinary = require('cloudinary');


exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        console.log(file.tempFilePath);
        if (height) {
            options.height = height;
        }
        if (quality) {
            options.quality = quality;
        }
        options.resource_type = 'auto';

        return await  cloudinary.v2.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error; // Propagate the error
    }
}