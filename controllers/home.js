const sneaksAPI = require('sneaks-api');
const sneaks = new sneaksAPI();

let limit = 60;


module.exports.index = async (req, res) => {
    function getMostPopularProducts(limit) {
        return new Promise((resolve, reject) => {
            sneaks.getMostPopular(limit, function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            });
        });
    }
    
    if (req.query.load) {
        limit += 12;
    } else {
        limit = 60;
    }
    const total_products = await getMostPopularProducts(limit);
    console.log(`loaded ${limit}`);
    console.log("total products returned: ",total_products.length);
    const products = total_products.slice(-12);

    res.render('home', { products, limit});
}