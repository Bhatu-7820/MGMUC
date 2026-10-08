/**
 * MGMU IICT Knowledge Base Schema
 *
 * Each document represents a verified piece of college information.
 * Metadata fields enable entity-scoped retrieval (e.g., "B.Tech CSE only")
 * and academic-year-aware filtering.
 */

const mongoose = require('mongoose');

const knowledgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'ADMISSION', 'COURSES', 'FEES', 'FACULTY', 'DEPARTMENT',
      'ACADEMICS', 'EXAM', 'RESULT', 'PLACEMENT', 'INTERNSHIP',
      'SCHOLARSHIP', 'HOSTEL', 'TRANSPORT', 'FACILITIES', 'EVENTS',
      'NOTICE', 'CONTACT', 'DOCUMENTS', 'ENROLLMENT', 'GENERAL', 'UNKNOWN'
    ],
    default: 'GENERAL',
    index: true
  },

  /**
   * The program(s) this document applies to.
   * Example: ['B.Tech CSE', 'B.Tech IT'] or ['MCA'] or [] (applies to all).
   * Leave empty for institution-wide information.
   */
  programs: [{
    type: String,
    trim: true,
    index: true
  }],

  /**
   * Department this document is specific to.
   * Example: 'Computer Science & Engineering' or 'All'
   */
  department: {
    type: String,
    trim: true,
    default: 'All'
  },

  /**
   * Academic year this information applies to.
   * Example: '2026-27'
   */
  academicYear: {
    type: String,
    trim: true,
    default: '2026-27',
    index: true
  },

  /**
   * Source authority level. Higher = more trustworthy.
   * See retrieval.service.js SOURCE_AUTHORITY map.
   */
  authorityLevel: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },

  content: {
    type: String,
    required: true
  },
  source: {
    type: String,
    default: 'MGMU IICT Official Database'
  },
  sourceUrl: {
    type: String,
    default: 'https://mgmu.ac.in/iict'
  },
  verified: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Published', 'Expired', 'Superseded'],
    default: 'Verified',
    index: true
  },
  publishedDate: {
    type: String,
    default: '2026-06-01'
  },
  retrievedDate: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  lastChecked: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  version: {
    type: String,
    default: '1.0'
  },
  sourceType: {
    type: String,
    default: 'INTERNAL_DATABASE'
  },
  hash: {
    type: String
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }]
}, {
  timestamps: true
});

// Full-text search index
knowledgeSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Compound indexes for entity-scoped retrieval
knowledgeSchema.index({ category: 1, programs: 1 });
knowledgeSchema.index({ category: 1, academicYear: 1 });

module.exports = mongoose.model('Knowledge', knowledgeSchema);
