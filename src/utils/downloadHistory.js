const downloadHistoryModel = require('../models/downloadHistory');

module.exports = {
    findAllDownloadHistory: async (conditions, pageNum, pageSize) => {
        try {
            const query = downloadHistoryModel.find(conditions);
            if (pageNum) query.skip((pageNum - 1) * pageSize);
            if (pageSize) query.limit(pageSize);
            query.sort({ createdAt: -1 });
            const downloadHistory = await query.exec();
            const numberOfDownloadHistory =
                // count documents based on conditions or not depending on the number of conditions
                Object.keys(conditions).length === 0
                    ? await downloadHistoryModel.countDocuments()
                    : await downloadHistoryModel.countDocuments(conditions);
            const hasNext = pageSize
                ? pageNum * pageSize < numberOfDownloadHistory
                : false;
            return [
                undefined,
                downloadHistory,
                numberOfDownloadHistory,
                hasNext
            ];
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
