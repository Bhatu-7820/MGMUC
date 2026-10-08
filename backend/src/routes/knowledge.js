const express = require('express');
const router = express.Router();
const {
  getCourses,
  getFaculty,
  searchAll,
  getCollegeSummary,
  getAllSources,
  updateSourceStatus,
  ingestSourceDocument
} = require('../controllers/knowledgeController');

router.get('/courses', getCourses);
router.get('/faculty', getFaculty);
router.get('/search', searchAll);
router.get('/summary', getCollegeSummary);

// Admin Knowledge Source Verification & Lifecycle routes
router.get('/sources', getAllSources);
router.post('/verify', updateSourceStatus);
router.post('/ingest', ingestSourceDocument);

module.exports = router;

