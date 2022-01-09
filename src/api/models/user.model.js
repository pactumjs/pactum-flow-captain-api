const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, default: '' },
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  modifiedAt: { type: Date, required: true, default: Date.now() },
  role: { type: String }
});

UserSchema.index({ username: 1 }, { unique: true });

module.exports = mongoose.model('User', UserSchema);