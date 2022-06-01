const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        modId: { type: String, required: true },
        profId: { type: String, required: true },
        authorId: { type: String, required: true }
    },
    { timestamps: true }
);

noteSchema.index({ modId: 1 });
noteSchema.index({ profId: 1 });
noteSchema.index({ authorId: 1 });

const notesModel = mongoose.model('notes', noteSchema);
module.exports = notesModel;
