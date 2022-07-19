const express = require('express');
const moment = require('moment');

const { createDocument } = require('../../utils/documents');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if (!req.body.noteId || !req.body.document) {
            throw new Error('Missing parameters');
        }
        const noteId = req.body.noteId;
        const document = req.body.document;
        const [createDocumentError, createdDocument] = await createDocument(
            noteId,
            document
        );
        if (createDocumentError) {
            throw new Error(createDocumentError);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                createdDocument
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error creating document', error);
        res.status(500).json(`Error creating document: ${error}`);
    }
});

module.exports = router;
