// OneRoom.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Map from './Map/Map';
import Item from './Item/Item';

function OneRoom() {
    return (
        <div className="container">
            <Routes>
                <Route path="map" element={<Map />} />
                <Route path="item" element={<Item />} />
            </Routes>
        </div>
    )
}

export default OneRoom;