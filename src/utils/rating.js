const ratingModel = require('../models/rating');

module.exports = {
    updateAndGetAverageRating: async (conditions, rating) => {
        try {
            const currRating = await ratingModel.findOne(conditions).exec();
            let newTotal = Number(rating);
            let newTotalNumber = 1;
            if (currRating){
                newTotal = currRating.totalRating + Number(rating);
                newTotalNumber = currRating.totalNumberOfRating + 1;
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
            let averageRating = 0;
            if (rating){
                averageRating = Number(rating.totalRating) / Number(rating.totalNumberOfRating);
            } 
            return [null, averageRating];
        } catch (error) {
            console.error('Error getting average rating to note', conditions, error);
            return [error, null];
        }
    }
}