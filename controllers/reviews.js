const Review = require('../models/review')
const Furniture = require('../models/furniture')

module.exports.createReview = async (req, res) => {
    const furniture = await Furniture.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    furniture.reviews.push(review);
    await review.save();
    await furniture.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/furnitures/${furniture._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Furniture.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted review!')
    res.redirect(`/furnitures/${id}`)
}