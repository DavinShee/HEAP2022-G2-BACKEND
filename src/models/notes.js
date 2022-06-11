const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
    {
        authorName: { type: String, required: true },
        description: { type: String, required: false },
        image: [{ type: String, required: true }],
        modId: { type: String, required: true },
        price: { type: Number, required: false },
        profName: { type: String, required: true },
        year: { type: String, required: true }
    },
    { timestamps: true }
);

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true},
        password: { type: String, required: true}
    },
    { timestamps: true }
);

noteSchema.index({ authorId: 1 });
noteSchema.index({ modId: 1 });
noteSchema.index({ profId: 1 });

const notesModel = mongoose.model('notes', noteSchema);
const usersModel = mongoose.model('users', userSchema);
module.exports = { notesModel, usersModel };
