const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RolesSchema = new Schema({
  isAdmin: { type: Boolean, default: false }
});


const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String},
  password: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  roles: { type: [RolesSchema] }
});

UserSchema.index({ username: 1}, { unique: true });

module.exports = mongoose.model('User', UserSchema);