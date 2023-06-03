const sneaksAPI = require('sneaks-api');
const sneaks = new sneaksAPI();



module.exports.index = async (req, res) => {
    function getMostPopularProducts(limit) {
        return new Promise((resolve, reject) => {
            sneaks.getMostPopular(limit, function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    // const sneakers = products;
                    resolve(products);
                }
            });
        });
    }

    const products = await getMostPopularProducts(10);
    console.log(products);
    res.render('home', { products });
}