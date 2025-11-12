const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary.js')

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_posts', 
    allowedformats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
