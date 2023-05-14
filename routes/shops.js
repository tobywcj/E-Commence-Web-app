const express = require('express');
const router = express.Router();

const multer  = require('multer'); // to parse the multipart/form-data form, adding a body object containing text input and a file or files object containing the uploaded files to the request object from the form
const { storage } = require('../cloudinary'); // for uploading files to cloudinary, NO need to specify.js path as node.js automatically searches for it in the current working directory
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' }) // for setting the dir to upload files ONLY for testing locally

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,  validateShop, isAuthor } = require('../middleware');
const shops = require('../controllers/shops');



//* SHOP routes, showing the routes, setting up the middlewares, passing the controllers

// all post, put, patch requests must have both client and server side validations 
// if there is duplicate code block, pass callback middleware func into route handler, run sth before res
router.route('/')
    .get(catchAsync(shops.index))
    .post(isLoggedIn, upload.array('images'), validateShop, catchAsync(shops.createShop)) // multer responsible to parse and add file and body obj to the req obj, but run after validation, so cant validate at server side without parsing the req obj

// need to put /new before /:id coz express will recognize new as id
router.get('/new', isLoggedIn, shops.renderNewForm)

router.route('/:id')
    .get(catchAsync(shops.showShop))
    .put(isLoggedIn, isAuthor, upload.array('images'), validateShop, catchAsync(shops.updateShop)) // validateShop only validate req.body not req.files
    .delete(isLoggedIn, isAuthor, catchAsync(shops.deleteShop))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shops.renderEditForm))



module.exports = router;
