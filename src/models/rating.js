const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
    {
        noteId: { type: String, required: true },
        totalRating: { type: Number, required: true },
        totalNumberOfRating: { type: Number, required: true}
    },
    { timestamps: true }
);

ratingSchema.index({ noteId: 1 });

const ratingModel = mongoose.model('rating', ratingSchema);
module.exports = ratingModel;
