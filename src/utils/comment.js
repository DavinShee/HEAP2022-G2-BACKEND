const notesModel = require('../models/notes');

module.exports = {
    addComments: async (id, comment) => {
        try {
            let userComments = await notesModel.findOne({ _id: id });
            if (userComments) {
                if (
                    userComments.comments.filter(
                        (e) => e.email === comment.email
                    ).length != 0
                ) {
                    // comment has already been added
                    error =
                        'user has already uploaded comment on this post before';
                    console.error(error);
                    return [error, null];
                }
                // user has not commented on this note yet, allow comment to be added
                let doc = await notesModel.findOneAndUpdate(
                    { _id: id },
                    { $push: { comments: { $each: [comment], $position: 0 } } },
                    {
                        new: true
                    }
                );
                return [undefined, doc];
            } else {
                // could not get note: note with that id does not exist
                error = 'Error getting note';
                console.error('Error adding comment to note', error);
                return [error, null];
            }
        } catch (error) {
            console.error('Error adding comment to note', error);
            return [error, null];
        }
    }
};
