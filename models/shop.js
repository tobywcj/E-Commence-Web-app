const mongoose = require('mongoose');
const Review = require('./review');
const { cloudinary } = require('../cloudinary');
const Schema = mongoose.Schema;



const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const shopSchema = new Schema({
    name: {
        type: String,
        // required: [true, 'Shop Name is required']
    },
    category: {
        type: String,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    images: [imageSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews: [
        {
        type: Schema.Types.ObjectId,
        ref: 'Review'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
        format: 'YYYY-MM-DD'
    }
})

shopSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        console.log(doc);
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
        console.log(`\n${doc.name}'s reviews deleted\n`);

        doc.images.forEach(async (image) => {
            await cloudinary.uploader.destroy(image.filename);
        });
        console.log(`\n${doc.name}'s images in cloudinary deleted\n`);

    } else {
        console.log('\nNo reviews found\n');
    }
})

module.exports = mongoose.model('Shop', shopSchema);