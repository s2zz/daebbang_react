//
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

//
import Info from "../Info/Info";

//
import style from "./List.module.css";

function List() {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달된 데이터 추출
  const { markersInBounds } = location.state || {};

  // 마커를 클릭하면 해당 마커의 내용을 들고 정보(info)로 감
  const handleMarkerClick = (marker) => {
    navigate("/home/oneroom/info", { state: marker });
  };

  //
  return (
    <div>
      <div className={style.list_cnt}>
        지역 목록
        <span className={style.unit_change}></span>
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
                <span className={style.recommend}>추천</span> {marker.a}
              </div>
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
