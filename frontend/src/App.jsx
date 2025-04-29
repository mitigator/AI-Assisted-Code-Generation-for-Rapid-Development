import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntityGenerationPage from './pages/EntityGenerationPage';
import EntityRefinementPage from './pages/EntityRefinementPage';
import Entity_Generation_Gemini from './pages/Entity_Generation_Gemini';
import Entity_Refinement_Gemini from './pages/Entity_Refinement_Gemini';
import EntityDisplayPage from './pages/EntityDisplayPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<EntityGenerationPage />} />
          <Route path="/refinement" element={<EntityRefinementPage />} />
          <Route path="/entity-generation" element={<Entity_Generation_Gemini/>} />
          <Route path="/entity-refinement" element={<Entity_Refinement_Gemini/>} />
          
          
          
        </Routes>
      </div>
    </Router>

  //   <Router>
  //   <div className="min-h-screen bg-gray-50">
  //     <header className="bg-white shadow-sm py-4">
  //       <div className="container mx-auto px-4">
  //         <h1 className="text-2xl font-bold text-gray-800">Entity Generator</h1>
  //       </div>
  //     </header>
      
  //     <main className="container mx-auto py-8 px-4">
  //       <Routes>
  //         <Route path="/" element={<Entity_Generation_Gemini />} />
  //         <Route path="/entity-display" element={<EntityDisplayPage />} />
  //       </Routes>
  //     </main>
  //   </div>
  // </Router>
  );
}

export default App;