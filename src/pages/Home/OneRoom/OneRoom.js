import React from "react";
import { Routes, Route } from "react-router-dom";
import { Helmet } from 'react-helmet';

import List from "./List/List";
import Info from "./Info/Info";

import style from './OneRoom.module.css';



function OneRoom() {
  return (
    <div className="container">
<Helmet>
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=97341ac4e80b9a87a5f181cdc1456971"></script>
      </Helmet>
      <div className={style.home_top}>
        <ul>
          <li>방 찾기</li>
          <li>찜한 매물</li>
          <li>방 내놓기(전월세만)</li>
        </ul>
      </div>

      <div className={style.main_box}>

        <div className={style.home_body_map}>
          지도 출력
        </div>

        <div className={style.home_body_info}>
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