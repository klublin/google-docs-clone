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
  },
  games: [{
    board: {
        id: {
            type: Number,
        },
        start_date: {
            type: String
        },
        grid: {
          type: [String]
        },
        winner: {
          type: String
        },
        createdAt: Date
    }
  }],
});

module.exports = mongoose.model('User', UserSchema);