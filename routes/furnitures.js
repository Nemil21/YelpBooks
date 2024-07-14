const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js')
const Furniture = require('../models/furniture')
const { isLoggedIn, isAuthor, validateFurniture } = require('../middleware.js')
const furnitures = require('../controllers/furnitures.js')
const multer = require('multer');
const { storage } = require('../cloudinary/index.js')
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(furnitures.index))
    .post(isLoggedIn, upload.array('image'), validateFurniture, catchAsync(furnitures.createFurniture));

router.get('/new', isLoggedIn, furnitures.renderNewForm)

router.route('/:id')
    .get(catchAsync(furnitures.showFurniture))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateFurniture, catchAsync(furnitures.updateFurniture))
    .delete(isLoggedIn, isAuthor, catchAsync(furnitures.deleteFurniture))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(furnitures.renderEditForm))

module.exports = router;