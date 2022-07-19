const ratingModel = require('../models/rating');

module.exports = {
    updateAndGetAverageRating: async (conditions, rating) => {
        try {
            const currRating = await ratingModel.findOne(conditions).exec();
            if (!currRating){
                var newTotal = Number(rating);
                var newTotalNumber = 1;
            } else {
                var newTotal = currRating.totalRating + Number(rating);
                var newTotalNumber = currRating.totalNumberOfRating + 1;
            }
            const updated = await ratingModel.updateOne(conditions, { totalRating: newTotal, totalNumberOfRating: newTotalNumber }, { upsert: true }).exec();
            const updatedRating = await ratingModel.findOne(conditions).exec();
            const averageRating = Number(updatedRating.totalRating) / Number(updatedRating.totalNumberOfRating);
            return [null, averageRating];
        } catch (error) {
            console.error('Error updating and getting rating to note', conditions, error);
            return [error, null];
        }
    },
    getAverageRating: async (conditions) => {
        try {
            const rating = await ratingModel.findOne(conditions).exec();
            if (rating){
                var averageRating = Number(rating.totalRating) / Number(rating.totalNumberOfRating);
            } else {
                var averageRating = 0;
            }
            return [null, averageRating];
        } catch (error) {
            console.error('Error getting average rating to note', conditions, error);
            return [error, null];
        }
    }
}