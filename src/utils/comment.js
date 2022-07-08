const notesModel = require('../models/notes');

module.exports = {
    addComments: async (id, comment) => {
        try {
            let doc = await notesModel.findOneAndUpdate(
                { _id: id },
                { $push: { comments: comment } },
                {
                    new: true
                }
            );
            return [undefined, doc];
        } catch (error) {
            console.error('Error adding comment to note', conditions, error);
            return [error, null];
        }
    }
};
