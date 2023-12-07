// List.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route, useNavigate } from "react-router-dom";

import style from "./List.module.css";
import Info from "../Info/Info";

function List() {
  const navigate = useNavigate();
  const location = useLocation();
  const { markersInBounds } = location.state || {}; // 전달된 데이터 추출

  const handleMarkerClick = (marker) => {
    navigate('/home/oneroom/info', { state: marker });
  };

  return (
    <div>
      <div className={style.list_cnt}>
        지역 목록
        <span className={style.unit_change}></span>
      </div>

      {markersInBounds && markersInBounds.map((marker, index) => (
        <div key={index} className={style.list_box} onClick={() => handleMarkerClick(marker)}>
          <div className={style.list_box_img}>
            {/* 이미지 */}
          </div>
          
          <div className={style.list_box_text}>
            <div className={style.list_box_top}><span className={style.recommend}>추천</span> {marker.a}</div>
            <div className={style.list_title}>{marker.b}</div>
            <div className={style.list_subtitle}>{marker.c}</div>
            <div className={style.list_subtitle}>{marker.d}</div>
            <div className={style.list_simple}>{marker.title}</div>
          </div>
        </div>
      ))}

      <Routes>
        <Route path="info" element={<Info />} />
      </Routes>
    </div>
  );
}

export default List;