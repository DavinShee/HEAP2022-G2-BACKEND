const notesModel = require('../models/notes');

module.exports = {
    addComments: async (id, comment) => {
        try {
            let userComments = await notesModel.findOne({ _id: id })
            if (userComments.comments) {
                if (userComments.comments.filter( e=> e.email === comment.email).length == 0) {
                    let doc = await notesModel.findOneAndUpdate(
                        { _id: id },
                        { $push: { comments: comment } },
                        {
                            new: true
                        }
                    );
                    return [undefined, doc];
                }
                error = "user has already uploaded comment on this post before";
                console.error('Error adding comment to note', conditions, error);
                return [error, null];
            } else {
                error = "Error getting note";
                console.error('Error adding comment to note', conditions, error);
                return [error, null];
            }
        } catch (error) {
            console.error('Error adding comment to note', conditions, error);
            return [error, null];
        }
    }
};
