import { useState } from 'react';
import viteLogo from '/vite.svg';
import './App.scss';
import Home from './pages/Home/Home';
import NotFound from './pages/NotFound/NotFound';
import Bio from './pages/Bio/Bio';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';
import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav/Nav';

const App = () => {

  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/bio" element={<Bio />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )};

export default App;
