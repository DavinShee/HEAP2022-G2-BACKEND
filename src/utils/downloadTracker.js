const notesModel = require('../models/notes');

module.exports = {
    incrementDownload: async (id) => {
        try {
            // Retrieve note by Id and increment download count by 1
            let doc = await notesModel.findOneAndUpdate(
                { _id: id },
                { $inc: { download: 1 } },
                { new: true }
            );
            return [undefined, doc];
        } catch (error) {
            console.error('Error increasing download', error);
            return [error, null];
        }
    }
};
