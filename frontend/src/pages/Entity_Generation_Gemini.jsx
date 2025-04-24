import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Entity_Generation_Gemini = () => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          projectName, 
          projectDescription: description 
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.warn("Backend warning:", data.error);
      }
      
      // Log the received JSON for debugging
      console.log("Received from backend:", data.json);
      
      // Navigate to entity display page with the generated JSON
      navigate('/entity-display', { 
        state: { generatedJSON: data.json } 
      });
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate entities. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Generate Project Entities</h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="projectName" className="block mb-1 font-medium">Project Name</label>
          <input
            id="projectName"
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block mb-1 font-medium">Project Description</label>
          <textarea
            id="description"
            placeholder="Describe your project in detail (e.g., 'A task management system with user accounts, projects, tasks, and deadlines')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded h-40"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition ${
            isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Generating...' : 'Generate Entities'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};

export default Entity_Generation_Gemini;