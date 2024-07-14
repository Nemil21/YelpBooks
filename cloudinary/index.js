const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dqeaomlck',
    api_key: '839996439987112',
    api_secret: 'pvKACDD8-zGMkEwzCMoEmw7lnlQ'
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'Furniture',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
})

module.exports = {
    cloudinary,
    storage
}