const mongoose = require('mongoose');
const usersModel = require('../models/user');

module.exports = {
    // finding user by email only 
    findUserByEmail: async (conditions) => {
        try {
            let doc = await usersModel.findOne({ email: conditions.email }).exec();
            if (doc) {
                console.log(doc)
                return [undefined, doc];
            }
            const error = 'Error getting account';
            console.error('Error getting account', error);
            return [error, null];
        } catch (error) {
            console.error('Error getting account', error);
            return [error, null];
        }
    }
}