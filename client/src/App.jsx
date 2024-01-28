import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Title from './Title';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NewPage from './NewPage';

function App() {

  return (
    <div>
      <Title />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="NewPage" element={<NewPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
