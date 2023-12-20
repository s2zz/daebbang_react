//
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

//
import Info from "../Info/Info";
import turn from "../assets/turn.PNG";

//
import style from "./List.module.css";

function List({ onDragEnd, listReady }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달된 데이터 추출
  const { markersInBounds } = location.state || {};
  // const size = Object.keys(markersInBounds).length;

  // 마커를 클릭하면 해당 마커의 내용을 들고 정보(info)로 감
  // 마커를 클릭하여 쿠키에 정보 추가
  const handleMarkerClick = (marker) => {
    navigate("/home/oneroom/info", { state: marker });

    // 로컬 스토리지에서 현재 감시 중인 속성 가져오기
    const storedData = localStorage.getItem("watch");
    const watchedProperties = storedData ? JSON.parse(storedData) : [];

    // 새로운 마커의 estateId를 감시 중인 속성에 추가
    const updatedWatchedProperties = [
      ...new Set([marker.estateId, ...watchedProperties]),
    ];
    // 감시 중인 속성을 최대 10개로 제한
    if (updatedWatchedProperties.length > 10) {
      updatedWatchedProperties.splice(10);
    }
    // 갱신된 감시 중인 속성을 로컬 스토리지에 저장
    localStorage.setItem("watch", JSON.stringify(updatedWatchedProperties));
  };

  // 숫자 포맷팅
  function formatPrice(price) {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000);
      const remainder = price % 10000;
      return `${billion}억${
        remainder > 0 ? ` ${remainder.toLocaleString()}` : ""
      }`;
    }
    return price.toLocaleString();
  }

  // 작성자(공인중개사) 매너온도 가져오기
  async function callAgentState() {
    try {
      const response = await axios.get('api/map/callAgentState');
      return response.data; // 응답 데이터 반환
    } catch (error) {
      console.error('Error fetching agent state:', error);
      throw error; // 에러 처리
    }
  }

  return (
    <div className={style.list_main}>
      <div className={style.list_cnt}>
        지역 목록
        <span className={style.unit_change}>
          <div>{/* <img src={turn} /> */}</div>
        </span>
      </div>

      {listReady &&
        markersInBounds &&
        markersInBounds.map((marker, index) => (
          <div
            key={index}
            className={style.list_box}
            onClick={() => handleMarkerClick(marker)}
          >
            <div className={style.list_box_img}>{/* 이미지 */}</div>

            <div className={style.list_box_text}>
              <div className={style.list_box_top}>
                <span className={style.recommend}>추천</span> {marker.structure.structureType}
                {marker.structureType}
              </div>
              <div className={style.list_title}>
                {marker.transaction.transactionType}{" "}
                {marker.deposit === 0
                  ? `${formatPrice(marker.price)}`
                  : `${formatPrice(marker.deposit)} / ${formatPrice(
                      marker.price
                    )}`}
              </div>
              <div className={style.list_subtitle}>
                {marker.area}평{" "}
                {marker.roomFloors === -1
                  ? "반지하"
                  : marker.roomFloors === 0
                  ? "옥탑"
                  : `${marker.roomFloors}층`}
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
