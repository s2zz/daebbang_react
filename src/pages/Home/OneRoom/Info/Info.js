// Info.js
import React from 'react';
import { useLocation } from 'react-router-dom';

function Info() {
  const location = useLocation();
  const markerInfo = location.state;

  return (
    <div>
      <h2>{markerInfo.title}</h2>
      <p>위도: {markerInfo.lat}</p>
      <p>경도: {markerInfo.lng}</p>
    </div>
  );
}

export default Info;