const mongoose = require('mongoose')
const { Schema, model } = mongoose

const TaskSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: String,
  description: String,
  status: String,
  reward: Number,
  studentId: String,
  claimedBy: String,
  paidOutAt: Date,
  refundedAt: Date,
  postedAt: Date,
  metadata: Schema.Types.Mixed
})

module.exports = model('Task', TaskSchema)
