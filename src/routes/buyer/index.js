const { Router } = require('express');
const express = require('express');
const { type } = require('express/lib/response');
const moment = require('moment');
const { findAllNotes } = require('../../utils/index');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const modId = req.query['mod-id'];
        const profName = req.query['prof-name'];
        const authorName = req.query['author-name'];

        const conditions = {};
        if (modId) conditions.modId = modId;
        if (profName) conditions.profId = profId;
        if (authorName) conditions.authordId = authordId;
        const [findAllNotesError, notes] = await findAllNotes(conditions);

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
