const express = require('express');
const moment = require('moment');
require('dotenv').config();
const { Comment, Note, CloudinaryDocument } = require('../../utils');
const { incrementDownload } = require('../../utils/downloadTracker');

const router = express.Router();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
    secure: true
});

router.get('/', async (req, res) => {
    try {
        const modId = req.query['mod-id'];
        const profName = req.query['prof-name'];
        const authorName = req.query['author-name'];
        const email = req.query['email'];
        const pageSize = Number(req.query['page-size']) || 6;
        const pageNum = Number(req.query['page-num']) || 1;

        const conditions = {};
        if (modId) conditions.modId = modId;
        if (profName)
            conditions.profName = { $regex: new RegExp(profName, 'i') };
        if (authorName)
            conditions.authorName = { $regex: new RegExp(authorName, 'i') };
        if (email) conditions.email = email;

        const [findAllNotesError, notes, numberOfNotes, hasNext] =
            await Note.findAllNotes(conditions, pageNum, pageSize);
        if (findAllNotesError) {
            throw new Error(findAllNotesError, conditions);
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
        res.status(500).json('Error getting notes ' + error);
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
        const [findNoteError, note] = await Note.findAllNotes(conditions);
        if (findNoteError) {
            throw new Error(findNoteError, conditions);
        }

        const modId = note[0].modId;

        // get all notes with the same modId
        conditions = { modId, _id: { $ne: id } };
        const [findAllNotesError, notes] = await Note.findAllNotes(conditions);
        if (findAllNotesError) {
            throw new Error(findAllNotesError, conditions);
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
        res.status(500).json('Error getting notes ' + error);
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
            !req.body.image ||
            !req.body.email
        ) {
            throw new Error('Missing parameters');
        }
        const authorName = req.body.authorName;
        const description = req.body.description;
        const email = req.body.email;
        const image = req.body.image;
        const modId = req.body.modId;
        const price = req.body.price;
        const profName = req.body.profName;
        const year = req.body.year;
        const comments = [];
        const download = 0;

        const [createCloudinaryUrlError, url] =
            await CloudinaryDocument.createUrl(image);
        if (createCloudinaryUrlError) {
            throw new Error(createCloudinaryUrlError);
        }

        const [createNoteError, note] = await Note.createNote(
            authorName,
            comments,
            description,
            download,
            email,
            image,
            modId,
            price,
            profName,
            url,
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
        res.status(500).json(`Error creating note: ${error}`);
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
        const increaseDownload = req.body.increaseDownload || false;

        const update = {};
        const conditions = {
            _id: id
        };
        // increment download by 1
        if (increaseDownload) {
            const [findAndUpdateNoteError] = await incrementDownload(id);
            if (findAndUpdateNoteError)
                throw new Error(findAndUpdateNoteError, conditions);
        }

        // adding comments
        if (comment) {
            if (comment.email && comment.fullname && comment.comment) {
                var today = new Date();
                var date =
                    today.getFullYear() +
                    '-' +
                    (today.getMonth() + 1) +
                    '-' +
                    today.getDate();
                var time =
                    today.getHours() +
                    ':' +
                    today.getMinutes() +
                    ':' +
                    today.getSeconds();
                var dateTime = date + ' ' + time;
                comment.dateTime = dateTime;

                const [error] = await Comment.addComments(id, comment);
                if (error) throw new Error(error, error);
            } else {
                throw new Error(
                    'Missing email and/or fullname and/or comment content as parameter'
                );
            }
        }

        if (authorName) update.authorName = authorName;
        if (description) update.description = description;
        if (image) update.image = image;
        if (modId) update.modId = modId;
        if (price) update.price = price;
        if (profName) update.profName = profName;
        if (year) update.year = year;
        const [error, note] = await Note.findAndUpdateNote(conditions, update);
        if (error) {
            throw new Error(error, conditions);
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
        res.status(500).json('Error getting notes ' + error);
    }
});

router.delete('/', async (req, res) => {
    try {
        const [error, deleteSuccess] = await Note.deleteAllNotes();
        if (error) {
            throw new Error(error, error);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                deleteSuccess
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error deleting all notes', error);
        res.status(500).json('Error deleting all notes ' + error);
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

        const [error, note] = await Note.findAndDeleteNote(conditions);
        if (error) {
            throw new Error(error, conditions);
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
        res.status(500).json('Error getting notes ' + error);
    }
});

module.exports = router;
