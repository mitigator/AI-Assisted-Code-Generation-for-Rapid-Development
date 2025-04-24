import axios from 'axios';

const FLOWS = {
  ENTITY_GENERATION: 'bb6caff7-e079-43f7-99f7-02e7487e1ba3',
  ENTITY_REFINEMENT: 'a2dc440d-f0de-447e-b7e7-061082d20c0a',
};

// Use the proxy path
const BASE_URL = '/api/v1/prediction';

export const queryEntityGeneration = async (question) => {
  try {
    const response = await axios.post(`${BASE_URL}/${FLOWS.ENTITY_GENERATION}`, { 
      question 
    });
    return extractEntities(response.data.text);
  } catch (error) {
    console.error('Error querying Entity Generation:', error);
    throw error;
  }
};

export const queryEntityRefinement = async (question) => {
  try {
    const response = await axios.post(`${BASE_URL}/${FLOWS.ENTITY_REFINEMENT}`, { 
      question 
    });
    return extractRefinementData(response.data.text);
  } catch (error) {
    console.error('Error querying Entity Refinement:', error);
    throw error;
  }
};

// Helper functions remain the same
const extractEntities = (text) => {
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing entity data:', error);
    throw new Error('Failed to parse entity data');
  }
};

const extractRefinementData = (text) => {
  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonString = text.substring(jsonStart, jsonEnd);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing refinement data:', error);
    throw new Error('Failed to parse refinement data');
  }
};