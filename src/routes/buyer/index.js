const { Router } = require('express');
const express = require('express');
const moment = require('moment');
const { findAllNotes } = require('../../utils');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const modId = req.query['mod-id'];
        const profId = req.query['prof-id'];
        const authordId = req.query['author-id'];

        const conditions = {};
        if (modId) conditions.modId = modId;
        if (profId) conditions.profId = profId;
        if (authordId) conditions.authordId = authordId;
        const [findAllNotesError, notes] = findAllNotes(conditions);

        if (findAllNotesError) {
            throw new Error('Error retrieving all notes', conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                notes
            }
        };
        res.json(response);
    } catch (error) {
        console.error(error);
    }
});
module.exports = router;
