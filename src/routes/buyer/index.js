const { Router } = require('express');
const express = require('express');
const res = require('express/lib/response');
const { type } = require('express/lib/response');
const moment = require('moment');
const {
    findAllNotes,
    createNote,
    findAndUpdateNote,
    findAndDeleteNote
} = require('../../utils/index');

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

router.patch('/:modId/:profName/:authorName', async (req, res) => {
    try {
        if (
            !req.params.modId &&
            !req.params.profName &&
            !req.params.authorName
        ) {
            throw new Error('Missing parameters');
        }
        const authorName = req.body.authorName || undefined;
        const description = req.body.description || undefined;
        const image = req.body.image || undefined;
        const modId = req.body.modId || undefined;
        const price = req.body.price || undefined;
        const profName = req.body.profName || undefined;
        const year = req.body.year || undefined;

        const update = {};
        const conditions = {
            modId: req.params.modId,
            profName: req.params.profName,
            authorName: req.params.authorName
        };

        if (authorName) update.authorName = authorName;
        if (description) update.description = description;
        if (image) update.image = image;
        if (modId) update.modId = modId;
        if (price) update.price = price;
        if (profName) update.profName = profName;
        if (year) update.year = year;

        const [error, note] = await findAndUpdateNote(conditions, update);
        if (error) {
            throw new Error('Error updating all notes', conditions);
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
        console.error('Error getting notes', error);
        res.json('Error getting notes');
    }
});

module.exports = router;
