import { useState } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Auth from './pages/auth/Auth.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Auth />} />
        <Route path='/auth' element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App
