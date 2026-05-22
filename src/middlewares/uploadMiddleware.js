const multer = require("multer");

const storage = multer.memoryStorage();         //file temporary stores in RAM and then directly uploaded to cloudinary

const upload = multer({
    storage
});

module.exports = upload;