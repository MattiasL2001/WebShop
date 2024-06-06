import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import Register from './views/Register';
import Login from './views/Login';
import Support from './views/Support';
import NoPage from './views/NoPage';
import './styles/styles.css';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/support" element={<Support />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

const UnauthorizedPage: React.FC = () => {
  return <div>Unauthorized access! Please log in to view this page.</div>;
};

export default App;
