const express = require('express');
const moment = require('moment');

const { createDocument, retrieveDocument } = require('../../utils/documents');

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

router.get('/:noteId', async (req, res) => {
    try {
        if (!req.params.noteId) {
            throw new Error('Missing parameters');
        }
        const noteId = req.params.noteId;
        const [retrieveDocumentError, document] = await retrieveDocument(
            noteId
        );
        if (retrieveDocumentError) throw new Error(retrieveDocumentError);

        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                document
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error retrieving document', error);
        res.status(500).json(`Error retrieving document: ${error}`);
    }
});

module.exports = router;
