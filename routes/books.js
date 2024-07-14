const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js')
const Book = require('../models/book.js')
const { isLoggedIn, isAuthor } = require('../middleware.js')
const books = require('../controllers/books.js');
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(books.index))
    .post(isLoggedIn, upload.array('image'), catchAsync(books.createBook));

router.get('/new', isLoggedIn, books.renderNewForm)

router.route('/:id')
    .get(catchAsync(books.showBook))
    .put(isLoggedIn, isAuthor, upload.array('image'), catchAsync(books.updateBook))
    .delete(isLoggedIn, isAuthor, catchAsync(books.deleteBook))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(books.renderEditForm))

module.exports = router;