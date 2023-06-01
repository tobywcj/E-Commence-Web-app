module.exports.index = (req, res) => {
    // getMostPopular(limit, callback) takes in a limit and returns an array of the current popular products curated by StockX
    // sneaks.getMostPopular(10, function (err, products) {
    //     // res.send(products);
    //     res.render('home', { products });
    // })

    res.render('home');
}