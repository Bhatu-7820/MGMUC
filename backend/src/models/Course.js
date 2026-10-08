const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  duration: { type: String, required: true },
  eligibility: { type: String, required: true },
  fees: { type: Number, required: true },
  intake: { type: Number, required: true },
  description: { type: String },
  syllabus: [{ semester: Number, subjects: [String] }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
