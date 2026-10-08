const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  qualification: { type: String },
  email: { type: String },
  experience: { type: String },
  expertise: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
