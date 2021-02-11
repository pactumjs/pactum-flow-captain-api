const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  username: { type: String, required: true },
  sessionToken : { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() }
});

module.exports = mongoose.model('Session', SessionSchema);