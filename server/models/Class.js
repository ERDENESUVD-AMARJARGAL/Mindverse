const mongoose = require('mongoose')
const { Schema, model } = mongoose

const ClassSchema = new Schema({
  id: { type: String, required: true, unique: true },
  teacherId: String,
  name: String,
  subject: String,
  icon: String,
  color: String,
  students: Number,
  maxStudents: Number,
  avg: String,
  avgClass: String,
  avgNum: Number,
  classCode: String,
  createdAt: Date,
  lessons: Schema.Types.Mixed,
  assignments: Schema.Types.Mixed,
  exams: Schema.Types.Mixed,
  studentList: Schema.Types.Mixed
})

module.exports = model('Class', ClassSchema)
