const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },  // the email is unique
        fullname: { type: String, required: true },  // so is the fullname
        password: { type: String, required: true },
        dateTime: { type: String, required: true }
    },
    { timestamps: true }
);

userSchema.index({ fullname: 1 });

const usersModel = mongoose.model('users', userSchema);
module.exports = usersModel;
