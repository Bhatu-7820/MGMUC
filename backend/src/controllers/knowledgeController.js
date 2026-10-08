const { searchCollegeData } = require('../services/search.service');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const Knowledge = require('../models/Knowledge');
const { getDBStatus, memoryStore } = require('../config/db');

const getCourses = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const courses = await Course.find();
      return res.json({ success: true, data: courses });
    }
    return res.json({ success: true, data: memoryStore.courses });
  } catch (err) {
    next(err);
  }
};

const getFaculty = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const faculty = await Faculty.find();
      return res.json({ success: true, data: faculty });
    }
    return res.json({ success: true, data: memoryStore.faculty });
  } catch (err) {
    next(err);
  }
};

const searchAll = async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const results = await searchCollegeData(q, category);
    return res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

const getCollegeSummary = async (req, res) => {
  return res.json({
    success: true,
    data: {
      university: "MGM University",
      institute: "Institute of Information and Communication Technology (IICT)",
      location: "Chhatrapati Sambhajinagar, Maharashtra",
      stats: {
        departments: 4,
        programs: 8,
        placementRate: "88%+",
        highestPackage: "12 LPA",
        avgPackage: "5.2 LPA"
      }
    }
  });
};

/**
 * Admin: Get all knowledge sources with verification status, academic year, and timestamps.
 */
const getAllSources = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    let items = [];

    if (dbStatus.connected) {
      items = await Knowledge.find().sort({ authorityLevel: -1, updatedAt: -1 });
    } else {
      items = memoryStore.knowledge;
    }

    const formatted = items.map(doc => ({
      id: doc._id || doc.id || doc.title,
      document: doc.title,
      source: doc.source,
      sourceUrl: doc.sourceUrl,
      category: doc.category,
      academicYear: doc.academicYear || '2026-27',
      publishedDate: doc.publishedDate || doc.lastUpdated || '2026-06-01',
      retrievedDate: doc.retrievedDate || doc.lastUpdated || '2026-10-01',
      lastChecked: doc.lastChecked || '2026-10-08',
      verified: doc.verified !== false,
      version: doc.version || '1.0',
      status: doc.status || (doc.verified !== false ? 'Verified' : 'Pending'),
      authorityLevel: doc.authorityLevel || 70,
      programs: doc.programs || []
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Update source verification status (Pending, Verified, Published, Expired, Superseded)
 */
const updateSourceStatus = async (req, res, next) => {
  try {
    const { id, status, academicYear } = req.body;
    const validStatuses = ['Pending', 'Verified', 'Published', 'Expired', 'Superseded'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const dbStatus = getDBStatus();
    let updated = null;

    if (dbStatus.connected) {
      updated = await Knowledge.findByIdAndUpdate(
        id,
        {
          status,
          ...(academicYear ? { academicYear } : {}),
          lastChecked: new Date().toISOString().split('T')[0]
        },
        { new: true }
      );
    } else {
      const item = memoryStore.knowledge.find(k => (k._id && k._id.toString() === id) || k.id === id || k.title === id);
      if (item) {
        item.status = status;
        if (academicYear) item.academicYear = academicYear;
        item.lastChecked = new Date().toISOString().split('T')[0];
        updated = item;
      }
    }

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Knowledge source document not found' });
    }

    return res.json({ success: true, message: `Status updated to ${status}`, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin: Ingest a new document or official web URL
 */
const ingestSourceDocument = async (req, res, next) => {
  try {
    const { title, category, content, source, sourceUrl, academicYear, authorityLevel, programs, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required for ingestion.' });
    }

    const newDoc = {
      title: title.trim(),
      category: category || 'GENERAL',
      content: content.trim(),
      source: source || 'Admin Ingested Official Document',
      sourceUrl: sourceUrl || 'https://mgmu.ac.in/iict',
      academicYear: academicYear || '2026-27',
      authorityLevel: authorityLevel ? parseInt(authorityLevel, 10) : 80,
      programs: Array.isArray(programs) ? programs : (programs ? [programs] : []),
      tags: Array.isArray(tags) ? tags : [],
      status: 'Verified',
      verified: true,
      version: '1.0',
      publishedDate: new Date().toISOString().split('T')[0],
      retrievedDate: new Date().toISOString().split('T')[0],
      lastChecked: new Date().toISOString().split('T')[0]
    };

    const dbStatus = getDBStatus();
    if (dbStatus.connected) {
      const created = await Knowledge.create(newDoc);
      return res.status(201).json({ success: true, message: 'Document ingested successfully', data: created });
    } else {
      newDoc._id = `k_${Date.now()}`;
      newDoc.id = newDoc._id;
      memoryStore.knowledge.push(newDoc);
      return res.status(201).json({ success: true, message: 'Document ingested in memory store', data: newDoc });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCourses,
  getFaculty,
  searchAll,
  getCollegeSummary,
  getAllSources,
  updateSourceStatus,
  ingestSourceDocument
};

