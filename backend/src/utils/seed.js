const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Knowledge = require('../models/Knowledge');
const Course = require('../models/Course');
const Faculty = require('../models/Faculty');
const { verifiedKnowledgeBase, mockCourses, mockFaculty } = require('./seedData');
const logger = require('./logger');

const seedDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mgmu_iict_chatbot';
  try {
    await mongoose.connect(mongoURI);
    logger.info('Connected to MongoDB for seeding...');

    await Knowledge.deleteMany({});
    await Course.deleteMany({});
    await Faculty.deleteMany({});

    await Knowledge.insertMany(verifiedKnowledgeBase);
    await Course.insertMany(mockCourses);
    await Faculty.insertMany(mockFaculty);

    logger.info('Successfully seeded MGMU IICT verified dataset!');
    process.exit(0);
  } catch (err) {
    logger.error(`Failed to seed DB: ${err.message}`);
    process.exit(1);
  }
};

seedDB();
