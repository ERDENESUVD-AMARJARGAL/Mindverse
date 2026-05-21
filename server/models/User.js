const mongoose = require('mongoose')
const { Schema, model } = mongoose

const UserSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  firstName: String,
  lastName: String,
  email: { type: String, index: true },
  password: String,
  role: String,
  balance: { type: Number, default: 0 },
  avatar: String,
  classId: [String],
  classProgress: Schema.Types.Mixed,
  createdAt: Date
})

module.exports = model('User', UserSchema)
