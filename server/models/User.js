const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: { type: String, unique: true, sparse: true }, //
  googleId: {
    type: String,
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  ProfileUrl: {
    type: String,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
