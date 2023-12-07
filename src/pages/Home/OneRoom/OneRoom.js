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
  const { kakao } = window;

  const navigate = useNavigate();

  useEffect(() => {
    handleDragEnd();
    setMapRendered(true);
  }, []);

  const getDefaultBounds = () => {
    // 페이지 로딩 시 기본 경계 반환
    return new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(36, 127),
      new kakao.maps.LatLng(37, 128)
    );
  };

  const handleDragEnd = (map) => {
    // 만약 map 인자가 전달되지 않았다면, 페이지 로딩 시 호출되는 경우이므로 getDefaultBounds로 기본 bounds를 생성한다.
    if (!map) {
      map = {
        getBounds: () => getDefaultBounds(),
      };
    }
    // 현재 지도의 경계를 가져오기
    const bounds = map.getBounds();
  
    // 경계에 포함된 마커들 찾기
    const markersInBounds = markerdata.filter((marker) => {
      const markerPosition = new kakao.maps.LatLng(marker.lat, marker.lng);
      return bounds.contain(markerPosition);
    });
    // 콘솔에 마커 갯수와 정보 찍기
    console.log("마커 갯수:", markersInBounds.length);
    console.log("마커 정보:", markersInBounds);
  
    // 이벤트가 발생하면 페이지 이동
      navigate('/home/oneroom/list', { state: { markersInBounds } });

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

<div>방 찾기</div>
<div>찜한 매물</div>
<div>방 내놓기(전월세만)</div>
<div><Link to="list">Go to List</Link></div>
<div><Link to="info">Go to Info</Link></div>

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