import React from 'react';
import { markerdata } from '../data/markerData'; // markerdata import
import { Routes, Route, useNavigate } from "react-router-dom";

import style from "./List.module.css";
import Info from "../Info/Info";


function List() {
  
{/* 옆에 메뉴 박스 클릭시에도 인포로 넘어가게 원룸에서 복붙해옴 */}
  const navigate = useNavigate();

  const handleMarkerClick = (marker) => {
    navigate('/home/oneroom/info', { state: marker });
  };

  return (
    <div>
      
      <div className={style.list_cnt}>
        지역 목록 {/* 개수 출력 */}
        <span className={style.unit_change}>
          {/* 단위아이콘 알아서 넣으셈 */}
        </span>
      </div>

      {markerdata.map((marker, index) => (
        <div key={index} className={style.list_box} onClick={() => handleMarkerClick(marker)}>
          <div className={style.list_box_img}>
            이미지
          </div>
          
          <div className={style.list_box_text}>
            <div className={style.list_box_top}><span className={style.recommend}>추천</span> {marker.a}</div>
            <div className={style.list_title}>{marker.b}</div>
            <div className={style.list_subtitle}>{marker.c}</div>
            <div className={style.list_subtitle}>{marker.d}</div>
            <div className={style.list_simple}>{marker.title}</div>
          </div>

          {/* <h3>마커 {index + 1} 정보</h3>
          <p>Title: {marker.title}</p>
          <p>Latitude: {marker.lat}</p>
          <p>Longitude: {marker.lng}</p> */}

        </div>
      ))}
        <Routes>
          <Route path="info" element={<Info />} />
        </Routes>
    </div>
  );
}

export default List;