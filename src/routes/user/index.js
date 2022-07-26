const express = require('express');
const moment = require('moment');
const { User } = require('../../utils');

const router = express.Router();

// getting user by email (used when more details of user is needed)
router.get('/:email', async (req, res) => {
    try {
        if (!req.params.email) {
            throw new Error('Missing parameters');
        }

        const [error, user] = await User.findUserByEmail({
            email: req.params.email
        });
        if (error) {
            throw new Error(error, conditions);
        }

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                user
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error getting user', error);
        res.status(500).json('Error getting user');
    }
});

module.exports = router;
