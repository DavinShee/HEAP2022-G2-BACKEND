const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        note: { type: Object, required: true }
    },
    { timestamps: true }
);

downloadHistorySchema.index({ email: 1 });

const downloadHistoryModel = mongoose.model(
    'downloadHistory',
    downloadHistorySchema
);
module.exports = downloadHistoryModel;
