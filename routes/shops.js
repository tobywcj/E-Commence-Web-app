const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn,  validateShop, isAuthor } = require('../middleware');
const shops = require('../controllers/shops');



// SHOP routes, showing the routes, setting up the middlewares, passing the controllers


// all post, put, patch requests must have both client and server side validations 
// if there is duplicate code block, pass callback middleware func into route handler, run sth before res
router.route('/')
    .get(catchAsync(shops.index))
    .post(isLoggedIn, validateShop, catchAsync(shops.renderNewForm)) 

// need to put /new before /:id coz express will recognize new as id
router.get('/new', isLoggedIn, shops.createShop)

router.route('/:id')
    .get(catchAsync(shops.showShop))
    .put(isLoggedIn, isAuthor, validateShop, catchAsync(shops.updateShop))
    .delete(isLoggedIn, isAuthor, catchAsync(shops.deleteShop))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(shops.renderEditForm))



module.exports = router;
