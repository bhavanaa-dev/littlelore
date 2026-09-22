// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import BookDetail from './pages/BookDetail';
import MyShelf from './pages/MyShelf';

function App() {
  return (
    <Router>
      <div className="app-bg min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/my-shelf" element={<MyShelf />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
