// server-side validation
const basejoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = basejoi.extend(extension)



module.exports.shopSchema = joi.object({ // validateShop only validate req.body not req.files
    shop: joi.object({
        name: joi.string().required().escapeHTML(),
        category:joi.string().required().escapeHTML(),
        location:joi.string().required().escapeHTML(),
        description:joi.string().required().escapeHTML()
        // image:joi.string().required() 
    }).required(),
    deleteImages: joi.array() 
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating:joi.number().required().min(0).max(5),
        body:joi.string().required().escapeHTML()
    }).required()
});