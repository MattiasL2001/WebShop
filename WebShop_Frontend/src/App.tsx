import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import './styles/App.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        {/* <Route path='*' element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  </div>
  );
}

const UnauthorizedPage: React.FC = () => {
  return <div>Unauthorized access! Please log in to view this page.</div>;
};

export default App;
