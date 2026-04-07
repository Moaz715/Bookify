const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const bookController = require('../controllers/bookController');
const {requireAuth} = require('../middleware/requireAuth'); 
const { isAdmin } = require("../middleware/isAdmin");
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(catchAsync(bookController.index))
    .post(requireAuth, isAdmin, upload.single('image'), catchAsync(bookController.createBook));

router.route('/:id')
    .get(catchAsync(bookController.getBook))
    .put(requireAuth, isAdmin, catchAsync(bookController.updateBook))
    .delete(requireAuth, isAdmin, catchAsync(bookController.deleteBook));

module.exports = router;