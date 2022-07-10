const mongoose = require('mongoose');
const loginTrackerModel = require('../models/loginTracker');

// to check that a session exists and has not expired
async function loginSessionValidation(email) {
    try {
        // checking if a session for the user exists
        const query = loginTrackerModel.findOne({ email: email });
        const userExistSession = await query.exec();
        if (userExistSession) {
            var currentDateTime = new Date();
            // checking if the expiry date has not yet been reached
            if (
                userExistSession.expiryDateTime.getTime() >
                currentDateTime.getTime()
            ) {
                return [undefined, userExistSession];
            }
            return [error, null];
        }
        return [error, null];
    } catch {
        console.error('Error validating user session', error);
        return [error, null];
    }
}

module.exports = {
    // creating a user session by starting the expiry date to 30 mins from now
    loginSessionStart: async (email) => {
        try {
            var currentDateTime = new Date();
            var expiryDateTime = new Date(
                currentDateTime.getTime() + 30 * 60000
            );

            // checking if the user session already exists
            const query = loginTrackerModel.findOne({ email: email });
            const userExistSession = await query.exec();
            if (userExistSession) {
                let doc = await loginTrackerModel
                    .findOneAndUpdate(
                        { email: email },
                        { expiryDateTime: expiryDateTime },
                        {
                            new: true
                        }
                    )
                    .exec();
                return [undefined, doc];
            } else {
                const doc = {
                    email,
                    expiryDateTime
                };
                let userSession = new loginTrackerModel(doc);
                userSession = await userSession.save();
                return [undefined, userSession];
            }
        } catch {
            console.error('Error creating user session', error);
            return [error, null];
        }
    },

    // updating expiry after API call is made
    loginSessionRenewal: async (email) => {
        try {
            const checking = await loginSessionValidation(email);
            if (checking) {
                var currentDateTime = new Date();
                var expiryDateTime = new Date(
                    currentDateTime.getTime() + 30 * 60000
                );
                let doc = await loginTrackerModel
                    .findOneAndUpdate(
                        { email: email },
                        { expiryDateTime: expiryDateTime },
                        {
                            new: true
                        }
                    )
                    .exec();
                return [undefined, doc];
            } else {
                console.error('Error updating user session', error);
                error = 'User was not signed in';
                return [error, null];
            }
        } catch {
            console.error('Error updating user session', error);
            return [error, null];
        }
    },
    loginSessionValidation
};
