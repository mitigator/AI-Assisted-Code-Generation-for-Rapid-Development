

const BASE_URL = 'http://localhost:3000/api/v1/prediction';

const FLOWS = {
  ENTITY_GENERATION: 'bb6caff7-e079-43f7-99f7-02e7487e1ba3',
  ENTITY_REFINEMENT: 'a2dc440d-f0de-447e-b7e7-061082d20c0a',
  
};

async function queryFlow(flowId, data) {
  try {
    const response = await fetch(`${BASE_URL}/${flowId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error querying Flowise API:', error);
    throw error;
  }
}


async function queryEntityGeneration(question) {
  return queryFlow(FLOWS.ENTITY_GENERATION, { question });
}

async function queryEntityRefinement(question) {
  return queryFlow(FLOWS.ENTITY_REFINEMENT, { question });
}

module.exports = {
  FLOWS,
  queryFlow,
  queryEntityGeneration,
  queryEntityRefinement,
};