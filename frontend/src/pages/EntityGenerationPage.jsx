import React, { useState, useEffect } from 'react';
import { queryEntityGeneration } from '../api/flowise';
import { useNavigate } from 'react-router-dom';

const EntityGenerationPage = () => {
  const [entities, setEntities] = useState([]);
  const [projectInfo, setProjectInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryEntityGeneration(question || 'Generate entities for an employee management system');
      setEntities(data.entities || []);
      setProjectInfo({
        name: data.project_name,
        description: data.project_description
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Entity Generation</h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Question/Prompt:</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question or prompt"
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Generating...' : 'Generate Entities'}
        </button>
      </div>

      <button
        onClick={() => navigate('/refinement')}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Go to Entity Refinement
      </button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {projectInfo.name && (
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">{projectInfo.name}</h2>
          <p>{projectInfo.description}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entities.map((entity, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">{entity.Entity_Name}</h3>
            <p className="text-gray-600 mb-3">{entity.Entity_Description}</p>
            <div>
              <h4 className="font-medium mb-1">Fields:</h4>
              <ul className="list-disc pl-5">
                {entity.Fields.map((field, idx) => (
                  <li key={idx}>{field}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EntityGenerationPage;