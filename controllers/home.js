

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

    const products = await getMostPopularProducts(3);

    res.render('home', { products });
}