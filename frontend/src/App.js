import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EditDocument from './EditDocument';
import ViewDocument from './ViewDocument';
import Home from './Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/doc/:id/edit" element={<EditDocument/>} />
        <Route path="/doc/:id/view" element={<ViewDocument/>} />
      </Routes>
    </Router>
  );
}

export default App;
