// server-side validation
const Joi = require('joi');

module.exports.shopSchema = Joi.object({ // validateShop only validate req.body not req.files
    shop: Joi.object({
        name:Joi.string().required(),
        category:Joi.string().required(),
        location:Joi.string().required(),
        description:Joi.string().required()
        // image:Joi.string().required() 
    }).required(),
    deleteImages: Joi.array() 
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required().min(0).max(5),
        body:Joi.string().required()
    }).required()
});