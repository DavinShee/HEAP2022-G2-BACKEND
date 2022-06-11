const mongoose = require('mongoose');
const { notesModel, usersModel } = require('../models/notes');

module.exports = {
    findAllNotes: async (conditions) => {
        try {
            const query = notesModel.find(conditions);
            query.sort({ createdAt: -1 });

            const notes = await query.exec();
            return [undefined, notes];
        } catch (error) {
            console.error('Error getting all notes', conditions, error);
            return [error, null];
        }
    },
    createNote: async (
        authorName,
        description,
        image,
        modId,
        price,
        profName,
        year
    ) => {
        try {
            const doc = {
                authorName,
                description,
                image,
                modId,
                price,
                profName,
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
    findUser: async (conditions) => {
        try {
            const query = usersModel.find(conditions);
            query.sort({ createdAt: -1 });
 
            const user = await query.exec();
            return [undefined, user];
        } catch (error) {
            console.error('Error retrieving account', conditions, error);
            return [error, null];
        }
    },
    createUser: async (email, password) => {
        try {
            const temp = { email, password };
            let user = new usersModel(temp);
            user = await user.save();
            return [undefined, user];
        } catch (error) {
            console.error('Error creating account', error);
            return [error, null];
        }
    }
};
