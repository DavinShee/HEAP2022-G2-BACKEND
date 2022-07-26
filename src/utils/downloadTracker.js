const notesModel = require('../models/notes');

module.exports = {
    incrementDownload: async (id) => {
        try {
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
