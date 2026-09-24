const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { requireAuth } = require('../middleware/requireAuth'); 
const { isAdmin } = require("../middleware/isAdmin");
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(bookController.index)
    .post(requireAuth, isAdmin, upload.single('image'), bookController.createBook);

router.route('/:id')
    .get(bookController.getBook)
    .put(requireAuth, isAdmin, bookController.updateBook)
    .delete(requireAuth, isAdmin, bookController.deleteBook);

module.exports = router;