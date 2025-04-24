import React from 'react'
import { useLocation } from 'react-router-dom';


const Entity_Refinement_Gemini = () => {
    const location = useLocation();
    const { entities } = location.state;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Select Entities</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entities.map((entity, index) => (
          <div key={index} className="border p-4 rounded shadow bg-white">
            <h3 className="font-semibold text-lg">{entity.entity_name}</h3>
            <p className="text-sm text-gray-600 mb-2">{entity.entity_description}</p>
            <ul className="text-sm list-disc list-inside mb-2">
              {entity.fields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
            <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Entity_Refinement_Gemini
