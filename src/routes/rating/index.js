const express = require('express');
const moment = require('moment');
const { Rating } = require('../../utils');

const router = express.Router();

// updating and getting rating after user has rated a note
router.post('/', async (req, res) => {
    try {
        if (!req.body.noteId || !req.body.rating) {
            throw new Error('Missing noteId and/or rating');
        }

        const noteId = req.body.noteId;
        const rating = req.body.rating;

        const conditions = { noteId: noteId };
        const [updateAndGetAverageRatingError, averageRating] =
            await Rating.updateAndGetAverageRating(conditions, rating);
        if (updateAndGetAverageRatingError) {
            throw new Error(updateAndGetAverageRatingError, conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                averageRating
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error updating and getting average rating', error);
        res.status(500).json(
            `Error updating and getting average rating: ${error}`
        );
    }
});

// getting the rating of a note (get by id of note)
router.get('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Missing email');
        }
        const noteId = req.params.id;

        const conditions = { noteId: noteId };
        const [getAverageRatingError, averageRating] =
            await Rating.getAverageRating(conditions);
        if (getAverageRatingError) {
            throw new Error(getAverageRatingError, conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                averageRating
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error getting rating', error);
        res.status(500).json(`Error getting rating: ${error}`);
    }
});

module.exports = router;
