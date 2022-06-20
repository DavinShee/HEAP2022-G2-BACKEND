const mongoose = require('mongoose');

const loginTrackerSchema = new mongoose.Schema({
    email: { type: String, required: true },
    expiryDateTime: { type: Date, required: true }
});

loginTrackerSchema.index({ email: 1 });

const loginTrackerModel = mongoose.model('loginTracker', loginTrackerSchema);
module.exports = loginTrackerModel;
