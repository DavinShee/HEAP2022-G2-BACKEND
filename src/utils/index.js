const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const notesModel = require('../models/notes');
const usersModel = require('../models/user');

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
    // logging the user in
    // findUser: async (conditions) => {
    //     try {
    //         const query = usersModel.find(conditions);
    //         query.sort({ createdAt: -1 });

    //         const user = await query.exec();
    //         return [undefined, user];
    //     } catch (error) {
    //         console.error('Error retrieving account', conditions, error);
    //         return [error, null];
    //     }
    // },
    createUser: async (email, fullname, password, dateTime) => {
        try {
            // checking if the fullname is unique
            const check = await usersModel.find({ fullname: fullname }).exec();
            if (check.length == 0) {
                const doc = { email, fullname, password, dateTime };
                let user = new usersModel(doc);

                // generate salt to hash password
                const salt = await bcrypt.genSalt(10);
                // now we set user password to hashed password
                user.password = await bcrypt.hash(user.password, salt);

                user = await user.save();
                return [undefined, user];   
            } else {
                console.error('Error creating account as fullname is taken');
                error = 'Fullname is taken';
                return [error, null];
            }
        } catch (error) {
            console.error('Error creating account', error);
            return [error, null];
        }
    }
    // findAndUpdateUser: async (conditions, update) => {
    //     try {
    //         let doc = await usersModel
    //             .findOneAndUpdate(conditions, update, {
    //                 new: true
    //             })
    //             .exec();
    //         return [undefined, doc];
    //     } catch (error) {
    //         console.error('Error updating note', error);
    //         return [error, null];
    //     }
    // },
    // findAndDeleteUser: async (conditions) => {
    //     try {
    //         let doc = await notesModel.findOneAndDelete(conditions).exec();
    //         return [undefined, doc];
    //     } catch (error) {
    //         console.error('Error deleting note', error);
    //         return [error, null];
    //     }
    //},
};
