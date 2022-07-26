const express = require('express');
const moment = require('moment');
const {
    findAllDownloadHistory,
    createDownloadHistory
} = require('../../utils/downloadHistory');

const router = express.Router();

router.get('/:email', async (req, res) => {
    try {
        if (!req.params.email) {
            throw new Error('Missing email');
        }
        const email = req.params.email;
        const pageSize = Number(req.query['page-size']) || 6;
        const pageNum = Number(req.query['page-num']) || 1;

        const conditions = { email: email };
        const [
            findAllDownloadHistoryError,
            downloadHistory,
            numberOfDownloadHistory,
            hasNext
        ] = await findAllDownloadHistory(conditions, pageNum, pageSize);
        if (findAllDownloadHistoryError) {
            throw new Error(findAllDownloadHistoryError, conditions);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                downloadHistory,
                numberOfDownloadHistory,
                hasNext
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error getting downloadHistory', error);
        res.status(500).json('Error getting downloadHistory ' + error);
    }
});

router.post('/', async (req, res) => {
    try {
        if (!req.body.email) {
            throw new Error('Missing email');
        }
        const email = req.body.email;
        const noteId = req.body.noteId;
        const [createDownloadHistoryError, downloadHistory] =
            await createDownloadHistory(email, noteId);
        if (createDownloadHistoryError) {
            throw new Error(createDownloadHistoryError);
        }
        const response = {
            status: 200,
            timestamp: moment().format(),
            data: {
                downloadHistory
            }
        };
        res.json(response);
    } catch (error) {
        console.error('Error creating downloadHistory', error);
        res.status(500).json('Error creating downloadHistory ' + error);
    }
});

module.exports = router;
