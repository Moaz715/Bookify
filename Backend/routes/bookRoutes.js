const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const bookController = require('../controllers/bookController');

router.route('/')
    .get(catchAsync(bookController.index))
    .post(catchAsync(bookController.createBook));

router.route('/:id')
    .get(catchAsync(bookController.getBook))
    .put(catchAsync(bookController.updateBook))
    .delete(catchAsync(bookController.deleteBook));

module.exports = router;