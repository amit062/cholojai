const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: { type: String },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  visitedDestinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
