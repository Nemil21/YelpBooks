const mongoose = require('mongoose')
const Review = require('./review')
const Schema = mongoose.Schema
const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const opts = { toJSON: { virtuals: true } };

const bookSchema = new Schema({
    title: String,
    description: String,
    isbn: String,
    images: [ImageSchema],
    price: Number,
    publishDate: Date,
    author: String,
    quantity: Number,
    printType: String,
    categories: [String],
    pageCount: Number,
    language: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

bookSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href ="/books/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`
})

bookSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('Book', bookSchema)