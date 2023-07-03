const { shopSchema, reviewSchema, categorySchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Shop = require('./models/shop');
const Review = require('./models/review');


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // from passport middleware
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be logged in to continue');
        return res.redirect('/users/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateShop = (req, res, next) => {
    const { error } = shopSchema.validate(req.body);
    if (error) {
        console.log('\Failed Shop validation\n');
        const msg = error.details.map(el => el.message).join(','); // in case more than one err msg
        throw new ExpressError(msg, 400); // throw new error will directly go to error handler, no next() is needed
    } else {
        console.log('\nPassed Shop validation\n');
        next(); // if no error, continue to next middleware, res.render/send will end the cycle
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log('\Failed Review validation\n');
        const msg = error.details.map(el => el.message).join(','); 
        throw new ExpressError(msg, 400);
    } else {
        console.log('\nPassed Review validation\n');
        next();
    }
}

module.exports.validateCategory = (req, res, next) => {
    console.log(req.body);
    const { error } = categorySchema.validate(req.body);
    if (error) {
        console.log('\Failed Category validation\n');
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('\nPassed Category validation\n');
        next();
    }
}


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const shop = await Shop.findById(id);
    if (!shop.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shops/${shop._id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/shops/${id}`);
    }
    next();
}