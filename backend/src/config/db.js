const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { verifiedKnowledgeBase, mockCourses, mockFaculty } = require('../utils/seedData');

let isMongoConnected = false;

// In-Memory store for offline / dev execution fallback
const memoryStore = {
  knowledge: [...verifiedKnowledgeBase],
  courses: [...mockCourses],
  faculty: [...mockFaculty],
  conversations: []
};

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mgmu_iict_chatbot';
  try {
    // Attempt MongoDB connection with 3s timeout
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    isMongoConnected = true;
    logger.info(`MongoDB Connected successfully to ${mongoose.connection.host}`);
  } catch (err) {
    isMongoConnected = false;
    logger.warn(`MongoDB Connection failed: ${err.message}. Operating in Verified In-Memory Dataset mode.`);
  }
};

const getDBStatus = () => ({
  connected: isMongoConnected,
  mode: isMongoConnected ? 'MongoDB Database' : 'Verified In-Memory Knowledge Engine'
});

module.exports = {
  connectDB,
  getDBStatus,
  memoryStore
};
