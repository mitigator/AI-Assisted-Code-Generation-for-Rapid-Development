import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2 className="text-xl text-red-600 mb-4">Something went wrong</h2>
          <p className="mb-4">There was an error processing the entity data.</p>
          <button 
            onClick={() => {
              this.setState({ hasError: false });
              this.props.onReset();
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const EntityCard = ({ entity, isSelected, toggleSelection }) => {
  return (
    <div className={`border rounded-lg p-4 shadow-md ${isSelected ? 'bg-blue-50 border-blue-500' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold">{entity.entity_name}</h3>
        <button
          onClick={() => toggleSelection(entity.entity_name)}
          className={`px-3 py-1 rounded ${
            isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
      <p className="text-gray-600 mb-3">{entity.entity_description}</p>
      <div>
        <h4 className="font-semibold mb-1">Fields:</h4>
        <div className="flex flex-wrap gap-2">
          {entity.fields.map((field) => (
            <span
              key={field}
              className="bg-gray-100 px-2 py-1 rounded text-sm"
            >
              {field}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Helper function to clean JSON string
const cleanJsonString = (jsonStr) => {
  if (!jsonStr) return "{}";
  
  // Remove markdown code blocks
  let cleaned = jsonStr;
  
  // Handle ```json format
  if (cleaned.includes("```")) {
    // Remove beginning markdown delimiter
    cleaned = cleaned.replace(/^```json\s*/g, '');
    cleaned = cleaned.replace(/^```\s*/g, '');
    
    // Remove ending markdown delimiter
    cleaned = cleaned.replace(/\s*```$/g, '');
  }
  
  // Trim whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
};

const EntityDisplayPageContent = ({ parsedData, handleGoBack }) => {
  const [selectedEntities, setSelectedEntities] = useState([]);

  const toggleEntitySelection = (entityName) => {
    setSelectedEntities((prev) => {
      if (prev.includes(entityName)) {
        return prev.filter((name) => name !== entityName);
      } else {
        return [...prev, entityName];
      }
    });
  };

  const handleContinue = () => {
    const selectedEntityObjects = parsedData.entities.filter(entity => 
      selectedEntities.includes(entity.entity_name)
    );
    
    console.log("Selected entities:", selectedEntityObjects);
    alert(`Selected entities: ${selectedEntities.join(', ')}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Entities for {parsedData.project_name || 'Project'}
      </h2>
      
      {parsedData.entities && parsedData.entities.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {parsedData.entities.map((entity) => (
              <EntityCard
                key={entity.entity_name}
                entity={entity}
                isSelected={selectedEntities.includes(entity.entity_name)}
                toggleSelection={toggleEntitySelection}
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Back
            </button>
            
            <div className="flex items-center gap-4">
              <p>
                {selectedEntities.length} {selectedEntities.length === 1 ? 'entity' : 'entities'} selected
              </p>
              <button
                onClick={handleContinue}
                disabled={selectedEntities.length === 0}
                className={`px-6 py-2 rounded ${
                  selectedEntities.length > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No entities available. Please generate entities first.</p>
          <button
            onClick={handleGoBack}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Go Back
          </button>
        </div>
      )}
    </div>
  );
};

const EntityDisplayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (location.state?.generatedJSON) {
        // Clean up the raw JSON string from Gemini
        const cleanedJsonStr = cleanJsonString(location.state.generatedJSON);
        console.log("Cleaned JSON string:", cleanedJsonStr);
        
        // Parse the JSON
        const parsed = JSON.parse(cleanedJsonStr);
        setJsonData(parsed);
      } else {
        setError("No entity data found");
      }
    } catch (err) {
      console.error("JSON parsing error:", err);
      console.log("Problematic JSON string:", location.state?.generatedJSON);
      setError("Failed to parse entity data");
    } finally {
      setLoading(false);
    }
  }, [location.state]);

  const handleGoBack = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p>Loading entity data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <div className="mb-4">
          <h3 className="font-bold">Raw JSON data received:</h3>
          <pre className="bg-gray-100 p-3 mt-2 rounded text-sm overflow-auto max-h-60">
            {location.state?.generatedJSON || "No data"}
          </pre>
        </div>
        <button 
          onClick={handleGoBack}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <ErrorBoundary onReset={handleGoBack}>
      <EntityDisplayPageContent 
        parsedData={jsonData} 
        handleGoBack={handleGoBack} 
      />
    </ErrorBoundary>
  );
};

export default EntityDisplayPage;