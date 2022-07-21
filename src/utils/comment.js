const notesModel = require('../models/notes');

module.exports = {
    addComments: async (id, comment) => {
        try {
            let userComments = await notesModel.findOne({ _id: id });
            if (userComments.comments) {
                // if user has not commented on this note yet, allow comment to be added
                if (
                    userComments.comments.filter(
                        (e) => e.email === comment.email
                    ).length == 0
                ) {
                    let doc = await notesModel.findOneAndUpdate(
                        { _id: id },
                        {
                            $push: {
                                comments: { $each: [comment], $position: 0 }
                            }
                        },
                        {
                            new: true
                        }
                    );
                    return [undefined, doc];
                }
                // throw error if comment has already been added
                error = 'user has already uploaded comment on this post before';
                console.error(error);
                return [error, null];
            } else {
                error = 'Error getting note';
                console.error('Error adding comment to note', error);
                return [error, null];
                console.log('test');
            }
        } catch (error) {
            console.error('Error adding comment to note', error);
            return [error, null];
        }
    }
};
