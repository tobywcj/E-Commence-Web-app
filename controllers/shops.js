// part of the MVC structure, modelling the data, rendering the views, controlling all the logic and query of the shops
const Shop = require('../models/shop');
const { cloudinary } = require('../cloudinary');



module.exports.index = async (req, res) => {
    const shops = await Shop.find({});
    res.render('shops/index', { shops });
}

module.exports.renderNewForm = (req, res) => {
    res.render('shops/new');
}


// object literal inside parentheses forces the JS interpreter to ensure that the arrow function returns an expression of an array of objects instead of a block of code
module.exports.createShop = async (req, res) => {
    const shop = new Shop(req.body.shop);
    shop.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // map is used to return a new array of object, which is imutatable to the original array.
    shop.author = req.user._id;
    console.log(shop);
    await shop.save();
    req.flash('success', 'Successfully made a new shop');
    res.redirect(`/shops/${shop._id}`);
}

module.exports.showShop = async (req, res) => {
    const shop = await Shop.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' }}).populate('author'); // make sure that you don't have old shop without reviews/author properties.
    // console.log(shop);
    if (!shop) {
        req.flash('error', 'Cannot find that shop!');
        return res.redirect('/shops'); // return to skip the rest of the code
    }
    res.render('shops/show', { shop });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const shop = await Shop.findById(id);
    if (!shop) {
        req.flash('error', 'Cannot find that shop!');
        return res.redirect('/shops'); // return to skip the rest of the code

    }
    res.render('shops/edit', { shop });
}

module.exports.updateShop = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const shop = await Shop.findByIdAndUpdate(id, { ...req.body.shop });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shop.images.push( ...imgs );
    await shop.save();
    if (req.body.deleteImages) {
        req.body.deleteImages.forEach(async (filename) => {
            await cloudinary.uploader.destroy(filename);
        });
        await shop.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}});
    }
    req.flash('success', `Successfully updated ${shop.name}`);
    res.redirect(`/shops/${shop._id}`);
}

module.exports.deleteShop = async (req, res) => {
    const { id } = req.params;
    const shop = await Shop.findById(id);
    await Shop.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${shop.name}`);
    res.redirect('/shops');
}

