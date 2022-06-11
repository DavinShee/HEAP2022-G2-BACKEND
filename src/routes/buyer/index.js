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
        if (profName) conditions.profName = profName;
        if (authorName) conditions.authorName = authorName;
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
        if (
            !req.body.modId ||
            !req.body.profName ||
            !req.body.authorName ||
            !req.body.year ||
            !req.body.price ||
            !req.body.description ||
            !req.body.image
        ) {
            throw new Error('Missing parameters');
        }
        const authorName = req.body.authorName;
        const description = req.body.description;
        const image = req.body.image;
        const modId = req.body.modId;
        const price = req.body.price;
        const profName = req.body.profName;
        const year = req.body.year;

        const [createNoteError, note] = await createNote(
            authorName,
            description,
            image,
            modId,
            price,
            profName,
            year
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
