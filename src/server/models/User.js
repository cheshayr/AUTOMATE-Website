const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: String,
  lastName: { type: String, required: true },
  suffix: String,
  age: { type: Number, required: true },
  sex: { type: String, required: true },
  birthdate: { type: Date, required: true },
  address: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  role: { type: String, default: 'staff' }
});

module.exports = mongoose.model('User', userSchema);
