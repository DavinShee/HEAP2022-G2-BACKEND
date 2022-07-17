const bcrypt = require('bcrypt');
const notesModel = require('../models/notes');
const usersModel = require('../models/user');

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
        email,
        image,
        modId,
        price,
        profName,
        year
    ) => {
        try {
            const doc = {
                authorName,
                comments,
                description,
                email,
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
    deleteAllNotes: async () => {
        try {
            await notesModel.deleteMany({});
            return [undefined, true];
        } catch (error) {
            console.error('Error delete all notes', error);
            return [error, null];
        }
    },
    // logging the user in
    findUser: async (conditions) => {
        try {
            const query = usersModel.findOne({ email: conditions.email });
            query.sort({ createdAt: -1 });

            const user = await query.exec();
            if (user) {
                // check user password with hashed password stored in the database
                const validPassword = await bcrypt.compare(
                    conditions.password,
                    user.password
                );
                if (validPassword) {
                    return [undefined, user];
                } else {
                    console.error('Error retrieving account', conditions);
                    error = 'Invalid Password';
                    return [error, null];
                }
            } else {
                console.error('Error retrieving account', conditions);
                error = 'User does not exist';
                return [error, null];
            }
        } catch (error) {
            console.error('Error retrieving account', conditions, error);
            return [error, null];
        }
    },
    createUser: async (email, fullname, password, dateTime) => {
        try {
            // checking if the fullname is unique
            const check_email = await usersModel.find({ email: email }).exec();
            if (check_email.length == 0) {
                const doc = { email, fullname, password, dateTime };
                let user = new usersModel(doc);

                // generate salt to hash password
                const salt = await bcrypt.genSalt(10);
                // now we set user password to hashed password
                user.password = await bcrypt.hash(user.password, salt);

                user = await user.save();
                return [undefined, user];
            } else {
                console.error('Error creating account as email is taken');
                error = 'Email is taken';
                return [error, null];
            }
        } catch (error) {
            console.error('Error creating account', error);
            return [error, null];
        }
    },
    findAndUpdateUser: async (conditions, password, update) => {
        try {
            // get the user from the database and use bcrypt.compare to compare the password and only if it matches then continue the code below
            const query = usersModel.findOne({ email: conditions.email });
            query.sort({ createdAt: -1 });
            const user = await query.exec();
            if (user) {
                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (validPassword) {
                    let doc = await usersModel
                        .findOneAndUpdate(conditions, update, {
                            // conditons only have email and fullname. update needs to have the newPassword as hashed, store in database as hashed
                            new: true
                        })
                        .exec();
                    return [undefined, doc];
                } else {
                    console.error('Error retrieving account', conditions);
                    error = 'Invalid Password';
                    return [error, null];
                }
            } else {
                console.error('Error retrieving account', conditions);
                error = 'User does not exist';
                return [error, null];
            }
        } catch (error) {
            console.error('Error updating user', error);
            return [error, null];
        }
    },
    findAndDeleteUser: async (conditions) => {
        try {
            let doc = await usersModel.findOneAndDelete(conditions).exec();
            if (doc == null) {
                const error = 'Error getting account';
                console.error('Error deleting account', error);
                return [error, null];
            }
            return [undefined, doc];
        } catch (error) {
            console.error('Error deleting account', error);
            return [error, null];
        }
    }
};
