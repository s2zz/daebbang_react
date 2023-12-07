import React from 'react';
import { markerdata } from '../data/markerData'; // markerdata import

function List() {
  return (
    <div>
      <h2>List 컴포넌트</h2>
      {markerdata.map((marker, index) => (
        <div key={index}>
          <h3>마커 {index + 1} 정보</h3>
          <p>Title: {marker.title}</p>
          <p>Latitude: {marker.lat}</p>
          <p>Longitude: {marker.lng}</p>
        </div>
      ))}
      <p>기타 리스트 출력 부분</p>
    </div>
  );
}

export default List;