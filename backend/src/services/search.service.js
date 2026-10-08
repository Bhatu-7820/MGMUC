const Knowledge = require('../models/Knowledge');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const { getDBStatus, memoryStore } = require('../config/db');
const logger = require('../utils/logger');

const searchCollegeData = async (query = '', category = null) => {
  const cleanQuery = query.trim().toLowerCase();
  const dbStatus = getDBStatus();

  if (!cleanQuery && !category) {
    // Return all summary items
    return {
      courses: memoryStore.courses,
      faculty: memoryStore.faculty,
      knowledge: memoryStore.knowledge.slice(0, 8)
    };
  }

  if (dbStatus.connected) {
    try {
      const searchRegex = new RegExp(cleanQuery, 'i');
      const categoryFilter = category ? { category: category.toUpperCase() } : {};

      const [knowledgeResults, courseResults, facultyResults] = await Promise.all([
        Knowledge.find({
          ...categoryFilter,
          $or: [
            { title: searchRegex },
            { content: searchRegex },
            { tags: searchRegex }
          ]
        }).limit(10),
        Course.find({
          $or: [
            { name: searchRegex },
            { code: searchRegex },
            { department: searchRegex }
          ]
        }).limit(5),
        Faculty.find({
          $or: [
            { name: searchRegex },
            { department: searchRegex },
            { expertise: searchRegex }
          ]
        }).limit(5)
      ]);

      return {
        knowledge: knowledgeResults,
        courses: courseResults,
        faculty: facultyResults
      };
    } catch (err) {
      logger.error(`MongoDB Search error: ${err.message}`);
    }
  }

  // Memory store search fallback
  const searchRegex = new RegExp(cleanQuery, 'i');
  
  const filteredKnowledge = memoryStore.knowledge.filter(k => {
    const catMatch = !category || k.category.toUpperCase() === category.toUpperCase();
    const queryMatch = !cleanQuery || searchRegex.test(k.title) || searchRegex.test(k.content) || k.tags.some(t => searchRegex.test(t));
    return catMatch && queryMatch;
  });

  const filteredCourses = memoryStore.courses.filter(c => {
    return !cleanQuery || searchRegex.test(c.name) || searchRegex.test(c.code) || searchRegex.test(c.department);
  });

  const filteredFaculty = memoryStore.faculty.filter(f => {
    return !cleanQuery || searchRegex.test(f.name) || searchRegex.test(f.department) || searchRegex.test(f.expertise);
  });

  return {
    knowledge: filteredKnowledge,
    courses: filteredCourses,
    faculty: filteredFaculty
  };
};

module.exports = {
  searchCollegeData
};
