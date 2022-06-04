const mongoose = require('mongoose');
const notesModel = require('../models/notes');

module.exports = {
    findAllNotes: async (conditions) => {
        try {
            const query = notesModel.find(conditions);
            query.sort({ createdAt: -1 });

            const notes = await query.exec();
            return [null, notes];
        } catch (error) {
            console.error('Error getting all notes', conditions, error);
            return [error, null];
        }
    }
};
