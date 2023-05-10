const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


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
    image: {
        type: String,
    },
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
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
        console.log(`\n${doc.name}'s reviews deleted\n`);
    } else {
        console.log('\nNo reviews found\n');
    
    }
})

module.exports = mongoose.model('Shop', shopSchema);