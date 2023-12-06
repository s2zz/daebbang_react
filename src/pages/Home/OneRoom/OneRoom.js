import React from "react";
import { Routes, Route } from "react-router-dom";
import Map from "./Map/Map";
import Item from "./Item/Item";
import style from './OneRoom.module.css';

<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=97341ac4e80b9a87a5f181cdc1456971"></script>

function OneRoom() {
  return (
    <div className="container">
      <div className="home_top">방찾기 / 찜한 매물 / 방 올리기</div>
      <div className={style.main_box}>
        <div className="home_body_map">

        </div>
        <div className="home_body_info">
          <Routes>
            <Route path="map" element={<Map />} />
            <Route path="item" element={<Item />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default OneRoom;
