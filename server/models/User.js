const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique : false
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
    default: "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg"
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
