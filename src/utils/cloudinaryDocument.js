const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
    secure: true
});

module.exports = {
    // generate a public URL for the PDF file based on its base64 dataURL string
    createUrl: async (dataURL) => {
        try {
            let url;
            let cloudinaryError;
            await cloudinary.uploader.upload(dataURL, function (error, result) {
                url = result.secure_url;
                cloudinaryError = error;
            });
            if (cloudinaryError) {
                throw new Error(cloudinaryError);
            }
            return [undefined, url];
        } catch (error) {
            console.error('Error creating cloudinary url', error);
            return [error, null];
        }
    }
};
