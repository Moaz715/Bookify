const multer = require('multer');

// Store the file in memory temporarily
const storage = multer.memoryStorage();

// Create the upload middleware (limits file size to 5MB)
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

module.exports = upload;