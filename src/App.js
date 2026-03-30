import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Search from './pages/Search';
import Profile from './pages/Profile';
import PublicProfile from './pages/PublicProfile';
import Feed from './pages/Feed';
import AlbumDetail from './pages/AlbumDetail';



function App() {
  const token = localStorage.getItem('token');

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
          <Route path="/search" element={token ? <Search /> : <Navigate to="/login" />} />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/users/:userId" element={<PublicProfile />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/albums/:mbid" element={<AlbumDetail />} />


        </Routes>
      </BrowserRouter>
  );
}

export default App;