const axios = require('axios');
const logger = require('../utils/logger');

/**
 * Normalizes external API responses into a unified verified object structure
 */
const normalizeApiResponse = (apiData, sourceName = 'External MGMU API') => {
  if (!apiData) return null;

  // Handle array or object
  const items = Array.isArray(apiData) ? apiData : [apiData];

  return items.map(item => ({
    title: item.title || item.name || item.subject || 'Verified MGMU IICT Information',
    content: item.content || item.description || item.details || JSON.stringify(item),
    category: (item.category || 'GENERAL').toUpperCase(),
    source: item.source || sourceName,
    sourceUrl: item.sourceUrl || item.url || 'https://mgmu.ac.in/iict',
    verified: item.verified !== undefined ? Boolean(item.verified) : true,
    lastUpdated: item.lastUpdated || new Date().toISOString().split('T')[0]
  }));
};

/**
 * Call Primary external API (Priority 1)
 */
const fetchFromPrimaryApi = async (query, category) => {
  const primaryUrl = process.env.PRIMARY_API_URL;
  if (!primaryUrl) return null;

  try {
    const response = await axios.post(
      `${primaryUrl}/search`,
      { query, category },
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRIMARY_API_KEY || ''}`,
          'Content-Type': 'application/json'
        },
        timeout: 4000
      }
    );

    if (response.data && response.data.success) {
      logger.info(`Successfully retrieved verified content from Primary API`);
      return normalizeApiResponse(response.data.data, 'MGMU IICT Primary Official API');
    }
  } catch (error) {
    logger.warn(`Primary API call failed: ${error.message}`);
  }
  return null;
};

/**
 * Call Secondary / Fallback external API (Priority 3)
 */
const fetchFromFallbackApi = async (query, category) => {
  const fallbackUrl = process.env.FALLBACK_API_URL;
  if (!fallbackUrl) return null;

  try {
    const response = await axios.post(
      `${fallbackUrl}/query`,
      { query, category },
      {
        headers: {
          'Authorization': `Bearer ${process.env.FALLBACK_API_KEY || ''}`,
          'Content-Type': 'application/json'
        },
        timeout: 4000
      }
    );

    if (response.data && response.data.data) {
      logger.info(`Successfully retrieved fallback verified content from External Fallback API`);
      return normalizeApiResponse(response.data.data, 'Secondary Verified College API Source');
    }
  } catch (error) {
    logger.warn(`Fallback API call failed: ${error.message}`);
  }
  return null;
};

module.exports = {
  fetchFromPrimaryApi,
  fetchFromFallbackApi,
  normalizeApiResponse
};
