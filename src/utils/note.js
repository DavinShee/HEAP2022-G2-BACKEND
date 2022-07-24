const notesModel = require('../models/notes');

module.exports = {
    findAllNotes: async (conditions, pageNum, pageSize) => {
        try {
            const query = notesModel.find(conditions);
            if (pageNum) query.skip((pageNum - 1) * pageSize);
            if (pageSize) query.limit(pageSize);
            query.sort({ createdAt: -1 });
            const notes = await query.exec();
            const numberOfNotes =
                // count documents based on conditions or not depending on the number of conditions
                Object.keys(conditions).length === 0
                    ? await notesModel.countDocuments()
                    : await notesModel.countDocuments(conditions);
            const hasNext = pageSize
                ? pageNum * pageSize < numberOfNotes
                : false;
            return [undefined, notes, numberOfNotes, hasNext];
        } catch (error) {
            console.error('Error getting all notes', conditions, error);
            return [error, null];
        }
    },
    createNote: async (
        authorName,
        comments,
        description,
        download,
        email,
        image,
        modId,
        price,
        profName,
        url,
        year
    ) => {
        try {
            const doc = {
                authorName,
                comments,
                description,
                download,
                email,
                image,
                modId,
                price,
                profName,
                url,
                year
            };
            let note = new notesModel(doc);
            note = await note.save();
            return [undefined, note];
        } catch (error) {
            console.error('Error creating note', error);
            return [error, null];
        }
    },
    findAndUpdateNote: async (conditions, update) => {
        try {
            let doc = await notesModel
                .findOneAndUpdate(conditions, update, {
                    new: true
                })
                .exec();
            return [undefined, doc];
        } catch (error) {
            console.error('Error updating note', error);
            return [error, null];
        }
    },
    findAndDeleteNote: async (conditions) => {
        try {
            let doc = await notesModel.findOneAndDelete(conditions).exec();
            return [undefined, doc];
        } catch (error) {
            console.error('Error deleting note', error);
            return [error, null];
        }
    },
    deleteAllNotes: async () => {
        try {
            await notesModel.deleteMany({});
            return [undefined, true];
        } catch (error) {
            console.error('Error delete all notes', error);
            return [error, null];
        }
    }
};
