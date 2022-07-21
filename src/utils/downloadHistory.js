const downloadHistoryModel = require('../models/downloadHistory');

module.exports = {
    findAllDownloadHistory: async (conditions, pageNum, pageSize) => {
        try {
            const noteArray = [];
            const query = downloadHistoryModel.find(conditions, 'note');
            if (pageNum) query.skip((pageNum - 1) * pageSize);
            if (pageSize) query.limit(pageSize);
            query.sort({ createdAt: -1 });
            const downloadHistory = await query.exec();

            for (const note of downloadHistory) {
                noteArray.push(note.note);
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
    createDownloadHistory: async (email, note) => {
        try {
            //check if note exists in database to prevent duplicate download history
            const download = await downloadHistoryModel.findOne({
                email: email,
                note: note
            });
            if (download) throw new Error('DownloadHistory already exists');
            
            // create new download history
            const doc = {
                email,
                note
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
