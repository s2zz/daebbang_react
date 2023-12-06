import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OneRoom from '../Home/OneRoom/OneRoom';



function Home() {
    return (
        <div className="container">
            <Routes>
                <Route path="/oneroom/*" element={<OneRoom />} />
                <Route path="/tworoom/*" element={<OneRoom />} />
            </Routes>
        </div>
    )
}
export default Home;