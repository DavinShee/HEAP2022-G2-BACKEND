const downloadHistoryModel = require('../models/downloadHistory');
const notesModel = require('../models/notes');

module.exports = {
    findAllDownloadHistory: async (conditions, pageNum, pageSize) => {
        try {
            const noteArray = [];
            const query = downloadHistoryModel.find(conditions, 'noteId');
            //const query = notesModel.find(conditions);
            if (pageNum) query.skip((pageNum - 1) * pageSize);
            if (pageSize) query.limit(pageSize);
            query.sort({ createdAt: -1 });
            const downloadHistory = await query.exec(); // array of noteId

            for (const note of downloadHistory) {
                const noteId = note.noteId;
                const noteQuery = notesModel.find({ _id: noteId });
                const noteDoc = await noteQuery.exec();
                noteArray.push(noteDoc[0]);
            }
            const numberOfDownloadHistory =
                // count documents based on conditions or not depending on the number of conditions
                Object.keys(conditions).length === 0
                    ? await downloadHistoryModel.countDocuments()
                    : await downloadHistoryModel.countDocuments(conditions);
            const hasNext = pageSize
                ? pageNum * pageSize < numberOfDownloadHistory
                : false;
            return [undefined, noteArray, numberOfDownloadHistory, hasNext];
        } catch (error) {
            console.error(
                'Error getting all downloadHistory',
                conditions,
                error
            );
            return [error, null];
        }
    },
    createDownloadHistory: async (email, noteId) => {
        try {
            //check if note exists in database to prevent duplicate download history
            const download = await downloadHistoryModel.findOne({
                email: email,
                noteId: noteId
            });
            if (download) throw new Error('DownloadHistory already exists');

            // create new download history
            const doc = {
                email,
                noteId
            };
            let downloadHistory = new downloadHistoryModel(doc);
            downloadHistory = await downloadHistory.save();
            return [undefined, downloadHistory];
        } catch (error) {
            console.error('Error creating downloadHistory', error);
            return [error, null];
        }
    }
};
