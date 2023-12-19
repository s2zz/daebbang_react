//
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import cookie from 'react-cookies';
import { useState, useEffect } from "react";

//
import Info from "../Info/Info";
import turn from "../assets/turn.PNG";

//
import style from "./List.module.css";

function List({ onDragEnd }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  

  // 전달된 데이터 추출
  const { markersInBounds } = location.state || {};

  // 마커를 클릭하면 해당 마커의 내용을 들고 정보(info)로 감
  // 마커를 클릭하여 쿠키에 정보 추가
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const handleMarkerClick = (marker) => {
    navigate("/home/oneroom/info", { state: marker });
    // 이전 배열의 복사본을 생성하고 새로운 marker를 추가
  const updatedRecentlyViewed = [...recentlyViewed, marker];

  // 최근 본 매물 배열 업데이트
  setRecentlyViewed(updatedRecentlyViewed);
   
  };
  return (
    <div className={style.list_main}>
      <div className={style.list_cnt}>
        지역 목록
        <span className={style.unit_change}>
          <div>
            <img src={turn} />
          </div>
        </span>
      </div>

      {markersInBounds &&
        markersInBounds.map((marker, index) => (
          <div
            key={index}
            className={style.list_box}
            onClick={() => handleMarkerClick(marker)}
          >
            <div className={style.list_box_img}>{/* 이미지 */}</div>

            <div className={style.list_box_text}>
              <div className={style.list_box_top}>
                <span className={style.recommend}>추천</span>
                {marker.structureType}
              </div>
              <div className={style.list_title}>월세 300 / {marker.price}</div>
              <div className={style.list_subtitle}>
                {marker.area}평 {marker.roomFloors}층
              </div>
              <div className={style.list_subtitle}>{marker.address2}</div>
              <div className={style.list_simple}>{marker.contents}</div>
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
