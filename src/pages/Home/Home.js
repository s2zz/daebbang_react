import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OneRoom from '../Home/OneRoom/OneRoom';

import { Map } from "react-kakao-maps-sdk";

const CallMap = () => {
<Map
center={{ lat: 33.5563, lng: 126.79581 }} // 지도의 중심 좌표
style={{ width: "100%", height: "100%" }} // 지도 크기
level={3} // 지도 확대 레벨
></Map>
}



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