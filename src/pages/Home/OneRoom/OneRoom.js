import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { markerdata } from "./data/markerData"; // 마커 데이터 가져오기

import List from "./List/List";
import Info from "./Info/Info";

import style from "./OneRoom.module.css";

function OneRoom() {
  const [mapRendered, setMapRendered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(6);
  const navigate = useNavigate();

  useEffect(() => {
    setMapRendered(true);
  }, []);

  const handleDragEnd = (map) => {
    // 이벤트가 발생하면 페이지 이동
    navigate('/home/oneroom/list');
  };

  const handleZoomChanged = (map) => {
    // Zoom level이 변경되면 페이지 이동
    setZoomLevel(map.getLevel());
    navigate(`/home/oneroom/list?zoom=${map.getLevel()}`);
  };

  const handleMarkerClick = (marker) => {
    navigate('/home/oneroom/info', { state: marker });
  };

  return (
    <div className="container">
      <div className={style.home_top}>
        <ul>
          <li>방 찾기</li>
          <li>찜한 매물</li>
          <li>방 내놓기(전월세만)</li>
          <li>
            <Link to="list">Go to List</Link>
          </li>
          <li>
            <Link to="info">Go to Info</Link>
          </li>
        </ul>
      </div>

      <div className={style.main_box}>
        <div className={style.home_body_map}>
          {mapRendered && (
            <Map
              center={{ lat: 36.84142696925057, lng: 127.14542099214732 }}
              style={{ width: "100%", height: "100%" }}
              level={zoomLevel}
              onDragEnd={handleDragEnd}
              onZoomChanged={handleZoomChanged}
            >
              {markerdata.map((marker, index) => (
                <MapMarker
                  key={index}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  options={{ title: marker.title }}
                  onClick={() => handleMarkerClick(marker)}
                />
              ))}
            </Map>
          )}
        </div>
        <div className={style.home_body_side}>
          <Routes>
            <Route path="list" element={<List />} />
            <Route path="info" element={<Info />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default OneRoom;