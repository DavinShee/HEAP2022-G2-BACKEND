const express = require('express');
const moment = require('moment');
const { addComments } = require('../../utils/comment');
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
        const pageSize = Number(req.query['page-size']);
        const pageNum = Number(req.query['page-num']);

        const conditions = {};
        if (modId) conditions.modId = modId;
        if (profName)
            conditions.profName = { $regex: new RegExp(profName, 'i') };
        if (authorName)
            conditions.authorName = { $regex: new RegExp(authorName, 'i') };
        const [findAllNotesError, notes, numberOfNotes, hasNext] =
            await findAllNotes(conditions, pageNum, pageSize);
        if (findAllNotesError) {
            throw new Error('Error retrieving all notes', conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                notes,
                numberOfNotes,
                hasNext
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error getting notes', error);
        res.json('Error getting notes');
    }
});

// Get related notes of the same mod by note id
router.get('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Missing note id');
        }
        const id = req.params.id;
        // get current note
        let conditions = { _id: id };
        const [findNoteError, note] = await findAllNotes(conditions);
        if (findNoteError) {
            throw new Error('Error retrieving similar notes', conditions);
        }

        const modId = note[0].modId;

        // get all notes with the same modId
        conditions = { modId, _id: { $ne: id } };
        const [findAllNotesError, notes] = await findAllNotes(conditions);
        if (findAllNotesError) {
            throw new Error('Error retrieving similar notes', conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                note: note[0],
                relatedNotes: notes
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error getting notes', error);
        res.json('Error getting notes');
    }
});

// create note
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
        const comments = [];

        const [createNoteError, note] = await createNote(
            authorName,
            comments,
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

router.patch('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Missing id as parameter');
        }
        const id = req.params.id;
        const authorName = req.body.authorName || undefined;
        const comment = req.body.comment || undefined;
        const description = req.body.description || undefined;
        const image = req.body.image || undefined;
        const modId = req.body.modId || undefined;
        const price = req.body.price || undefined;
        const profName = req.body.profName || undefined;
        const year = req.body.year || undefined;

        const update = {};
        const conditions = {
            _id: id
        };

        // adding comments
        if (comment) {
            const [error, note] = await addComments(id, comment);
            if (error) throw new Error('Error adding comment', error);
        }

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

router.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Missing parameters');
        }

        const conditions = {
            _id: req.params.id
        };

        const [error, note] = await findAndDeleteNote(conditions);
        if (error) {
            throw new Error('Error deleting note', conditions);
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
