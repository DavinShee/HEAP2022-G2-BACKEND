const { Router } = require('express');
const express = require('express');
const { type } = require('express/lib/response');
const moment = require('moment');

const { findAllNotes, createNote } = require('../../utils/index');

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
        console.error('Error getting notes', error);
        res.json('Error getting notes');
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.modId || !req.body.profName || !req.body.authorName) {
            throw new Error('Missing parameters');
        }
        const modId = req.body.modId;
        const profName = req.body.profName;
        const authorName = req.body.authorName;
        const [createNoteError, note] = await createNote(
            modId,
            profName,
            authorName
        );
        if (createNoteError) {
            throw createNoteError;
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                note
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error creating note', error);
        res.json(`Error creating note: ${error}`);
    }
});
module.exports = router;
