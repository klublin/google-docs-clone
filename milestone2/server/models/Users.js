const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    requried: true
  },
  email: {
    type: String,
    requred: true
  },
  key: {
    type: String
  },
  verified: {
    type: Boolean
  }
});

module.exports = mongoose.model('User', UserSchema);