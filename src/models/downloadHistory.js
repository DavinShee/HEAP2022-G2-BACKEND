const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        noteId: { type: String, required: true }
    },
    { timestamps: true }
);

downloadHistorySchema.index({ email: 1 });

const downloadHistoryModel = mongoose.model(
    'downloadHistory',
    downloadHistorySchema
);
module.exports = downloadHistoryModel;
