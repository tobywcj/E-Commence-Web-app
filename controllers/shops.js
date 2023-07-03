// part of the MVC structure, modelling the data, rendering the views, controlling all the logic and query of the shops
// Model is responsible for fetching and saving data to a database
// The View is responsible for rendering the HTML page and handling user input.
// The Controller is acts as an intermediary between the Model and View.It initializes the View, handles user input, and updates the View based on changes to the Model.

const Shop = require('../models/shop');
const Category = require('../models/category');

const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
// const categories = [
//     'Health and wellness',
//     'Fashion and beauty',
//     'Home decor and design',
//     'Technology and gadgets',
//     'Art and culture',
//     'Sustainable living',
//     'Outdoor activities',
//     'Specialty food and drink',
//     'Cafes, lounges, and bars'
// ];



module.exports.index = async (req, res) => {
    const { category } = req.query;
    const catagory_data = await Category.find({});
    const categories = catagory_data.map(obj => obj.name);
    console.log(categories);
    let shops = await Shop.find({});
    let selectedCategory = '';
    if (category && category !== '') {
        shops = await Shop.find({ category: category });
        selectedCategory = category;
    }
    res.render('shops/index', { shops, categories, selectedCategory });
}

module.exports.renderNewCategoryForm = async (req, res) => {
    res.render('shops/newCategory');
}

module.exports.newCategory = async (req, res, next) => {
    console.log(req.body.category);
    const newCategory = new Category(req.body.category);
    await newCategory.save();

    let shops = await Shop.find({});
    const catagory_data = await Category.find({});
    const categories = catagory_data.map(obj => obj.name);
    let selectedCategory = '';
    res.render('shops/index', { shops, categories, selectedCategory });
}

module.exports.renderNewForm = async (req, res) => {
    const catagory_data = await Category.find({});
    const categories = catagory_data.map(obj => obj.name);
    res.render('shops/new', { categories });
}


// object literal inside parentheses forces the JS interpreter to ensure that the arrow function returns an expression of an array of objects instead of a block of code
module.exports.createShop = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.shop.location,
        limit: 1
    }).send() 
    const shop = new Shop(req.body.shop);
    shop.geometry = geoData.body.features[0].geometry;
    shop.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // map is used to return a new array of object, which is imutatable to the original array.
    shop.author = req.user._id;
    console.log(shop);
    await shop.save();
    req.flash('success', `Successfully made a new shop called ${shop.name}`)
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
    const catagory_data = await Category.find({});
    const categories = catagory_data.map(obj => obj.name);
    const { id } = req.params;
    const shop = await Shop.findById(id);
    if (!shop) {
        req.flash('error', 'Cannot find that shop!');
        return res.redirect('/shops'); // return to skip the rest of the code

    }
    res.render('shops/edit', { shop, categories });
}

module.exports.updateShop = async (req, res) => {
    const { id } = req.params;
    const shop = await Shop.findByIdAndUpdate(id, { ...req.body.shop });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    shop.images.push( ...imgs );
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.shop.location,
        limit: 1
    }).send()
    shop.geometry = geoData.body.features[0].geometry;
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

