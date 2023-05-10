// part of the MVC structure, modelling the data, rendering the views, controlling all the logic and query of the shops
const Shop = require('../models/shop');



module.exports.index = async (req, res) => {
    const shops = await Shop.find({});
    res.render('shops/index', { shops });
}

module.exports.renderNewForm = async (req, res) => {
    const shop = new Shop(req.body.shop);
    shop.author = req.user._id;
    await shop.save();
    req.flash('success', 'Successfully made a new shop');
    res.redirect(`/shops/${shop._id}`);
}

module.exports.createShop = (req, res) => {
    res.render('shops/new');
}

module.exports.showShop = async (req, res) => {
    const shop = await Shop.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' }}).populate('author'); // make sure that you don't have old shop without reviews/author properties.
    console.log(shop);
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
    const shop = await Shop.findByIdAndUpdate(id, { ...req.body.shop });
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

