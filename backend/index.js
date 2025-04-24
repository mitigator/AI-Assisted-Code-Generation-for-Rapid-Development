// src/index.js
/**
 * Example usage of the Flowise API client in Node.js
 */

const flowiseClient = require('./api/flowise');

// Example: Using the specialized function for entity generation
async function testEntityGeneration() {
  try {
    console.log('Testing Entity Generation flow...');
    const response = await flowiseClient.queryEntityGeneration('Hey, how are you?');
    console.log('Entity Generation Response:', response);
    return response;
  } catch (error) {
    console.error('Entity Generation test failed:', error);
  }
}

// Example: Using the specialized function for entity refinement
async function testEntityRefinement() {
  try {
    console.log('Testing Entity Refinement flow...');
    const response = await flowiseClient.queryEntityRefinement('Hey, how are you?');
    console.log('Entity Refinement Response:', response);
    return response;
  } catch (error) {
    console.error('Entity Refinement test failed:', error);
  }
}

// Run the examples
async function runExamples() {
  await testEntityGeneration();
  await testEntityRefinement();
}

// Execute and handle the main promise
runExamples()
  .then(() => console.log('All examples completed'))
  .catch(err => console.error('Error running examples:', err));