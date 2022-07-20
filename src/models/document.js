const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
    {
        noteId: { type: String, required: true },
        documentId: { type: String, required: true },
    },
    { timestamps: true }
);

documentSchema.index({ noteId: 1 });

const documentModel = mongoose.model('document', documentSchema);
module.exports = documentModel;
