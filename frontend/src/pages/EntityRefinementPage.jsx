import React, { useState, useEffect } from 'react';
import { queryEntityRefinement } from '../api/flowise';
import { useNavigate } from 'react-router-dom';

const EntityRefinementPage = () => {
  const [refinementData, setRefinementData] = useState({
    accepted_entities: [],
    suggested_entities: [],
    rejected_entities: []
  });
  const [projectInfo, setProjectInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const navigate = useNavigate();

  const handleRefine = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryEntityRefinement(question || 'Refine entities for an employee management system');
      setRefinementData({
        accepted_entities: data.accepted_entities || [],
        suggested_entities: data.suggested_entities || [],
        rejected_entities: data.rejected_entities || []
      });
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
      <h1 className="text-2xl font-bold mb-6">Entity Refinement</h1>
      
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
          onClick={handleRefine}
          disabled={loading}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Refining...' : 'Refine Entities'}
        </button>
      </div>

      <button
        onClick={() => navigate('/')}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Go to Entity Generation
      </button>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {projectInfo.name && (
        <div className="mb-8 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">{projectInfo.name}</h2>
          <p>{projectInfo.description}</p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Accepted Entities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {refinementData.accepted_entities.map((entity, index) => (
            <div key={`accepted-${index}`} className="border p-4 rounded shadow bg-green-50">
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Suggested Entities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {refinementData.suggested_entities.map((entity, index) => (
            <div key={`suggested-${index}`} className="border p-4 rounded shadow bg-yellow-50">
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

      {refinementData.rejected_entities.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Rejected Entities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {refinementData.rejected_entities.map((entity, index) => (
              <div key={`rejected-${index}`} className="border p-4 rounded shadow bg-red-50">
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
      )}
    </div>
  );
};

export default EntityRefinementPage;