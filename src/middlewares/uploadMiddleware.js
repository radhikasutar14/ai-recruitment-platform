const multer = require("multer");

const storage = multer.memoryStorage();         //file temporary stores in RAM and then directly uploaded to cloudinary

const upload = multer({
    storage,
    //----restrict the file type as pdf only-----------
    fileFilter: (req, file, cb) => {

        if (file.mimetype !== "application/pdf") {
            return cb(
                new Error("Only PDF files allowed"),
                false
            );
        }

        cb(null, true);
    }
});

module.exports = upload;