//
import { Routes, Route, useNavigate } from "react-router-dom"; // Link
import { useState, useEffect, useRef } from "react";
import { Map, MapMarker, MarkerClusterer } from "react-kakao-maps-sdk"; // ZoomControl

//
// import { markerdata } from "./data/markerData"; // 마커 데이터 가져오기

//
import $ from "jquery";
import axios from "axios";

//
import List from "./List/List";
import Info from "./Info/Info";

//
import style from "./OneRoom.module.css";

function OneRoom() {
  const [mapRendered, setMapRendered] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(6);

  const [mapList, setMapList] = useState([{}]);
  // const [markersInBounds, setMarkersInBounds] = useState([]);
  // const [positions, setPositions] = useState([]);

  const [searchValue, setSearchValue] = useState("");
  const searchListBoxRef = useRef(null);

  const navigate = useNavigate();

  // NPM INSTALL 하면서 받은 카카오 정보들이
  // 로컬에 저장되어 있기 때문에 불러옴
  const { kakao } = window;

  // 1. 로딩 될때 지도 데이터 받음
  // 2. 전부 받고 맵 리스트에 저장하면 랜더링 완료 처리
  useEffect(() => {
    axios
      .get(`/api/map/getAll`)
      .then((resp) => {
        setMapList(resp.data);
        setMapRendered(true);
      })
      .catch((err) => {
        console.log("API 호출 오류:", err);
      });
  }, []);

  // 1. 랜더링 변경 값이 있을때 의존성 실행
  // 2. 랜더링이 완료로 변경되면 이벤트 드레그 실행
  useEffect(() => {
    if (mapRendered) {
      handleDragEnd();
    }
  }, [mapRendered]);

  // 페이지 로딩 시 사용할 기본 경계 반환
  const getDefaultBounds = () => {
    return new kakao.maps.LatLngBounds(
      new kakao.maps.LatLng(36, 127),
      new kakao.maps.LatLng(37, 128)
    );
  };

  // 지도에서 마우스 드레그 이벤트 발생시 마커 새로 불러오기
  const handleDragEnd = (map) => {
    // map 인자가 받지 못한건 처음 페이지 켤때니까
    // get Bouns에 기본 바운스를 넣어줌 안 그럼 맵이 없어서 값이 없음
    if (!map) {
      map = {
        getBounds: () => getDefaultBounds(),
      };
    }

    // 현재 지도의 경계를 맵 인자에서 가져옴
    const bounds = map.getBounds();

    // 경계(현재 화면)에 포함된 마커들 찾기
    const markersInBounds = mapList.filter((marker) => {
      const markerPosition = new kakao.maps.LatLng(
        marker.latitude,
        marker.longitude
      );
      return bounds.contain(markerPosition);
    });

    // 이벤트가 발생하면 페이지 이동
    navigate("/home/oneroom/list", { state: { markersInBounds } });
  };

  // 지도에서 휠을 활용한 줌 이벤트 발생시 마커 새로 불러오기
  const handleZoomChanged = (map) => {
    // Zoom level이 변경되면 페이지 이동
    setZoomLevel(map.getLevel());

    // 현재 지도의 경계를 맵 인자에서 가져옴
    const bounds = map.getBounds();

    // 경계(현재 화면)에 포함된 마커들 찾기
    const markersInBounds = mapList.filter((marker) => {
      const markerPosition = new kakao.maps.LatLng(
        marker.latitude,
        marker.longitude
      );
      return bounds.contain(markerPosition);
    });

    // 이벤트가 발생하면 페이지 이동하면서 바뀐 경계 (현재 화면) 값을 넘김
    navigate(`/home/oneroom/list?zoom=${map.getLevel()}`, {
      state: { markersInBounds },
    });
  };

  // 마커를 클릭할때 해당 정보를 들고 info(정보)로 이동
  const handleMarkerClick = (marker) => {
    navigate("/home/oneroom/info", { state: marker });
  };

  // 검색창 사용
  const handleInputChange = (event) => {
    // 받은 데이터의 길이 (2글자 이상인지 체크하기 위한거임)
    const inputValue = event.target.value;
    setSearchValue(inputValue);

    // 리스트 박스를 찾기 위해서 쓰는 Ref
    const searchListBox = searchListBoxRef.current;

    // List에 넣을 CSS를 사용하기 위해 만드는 마크업
    const regionSpan = document.createElement("span");
    const regionDiv = document.createElement("div");

    // 2글자 이상일 때 active 클래스를 추가하고, display를 block으로 설정
    if (inputValue.length >= 2) {

      // 숨겨놨던 리스트 Div를 풀어줌
      searchListBox.classList.add(style.active);
      searchListBox.style.display = "block";

      axios
        .get(`/api/map/getKeywordSearch`, {
          params: {
            keyword: inputValue, // inputValue를 'keyword'라는 이름으로 전달
          },
        })
        .then((resp) => {
          // resp.data를 순회하며 각 지역의 시군구 정보를 <div>에 추가
          const examDiv = document.querySelector(".exam");
          searchListBox.innerHTML = ""; // 기존 내용을 초기화

          // 검색된 데이터가 없을때
          if (resp.data.length === 0) {
            regionSpan.textContent = `검색된 항목이 없습니다.`;
            regionDiv.appendChild(regionSpan);
            searchListBox.appendChild(regionDiv);
          }

          // region에는 각 지역 정보가 들어 있음
          resp.data.forEach((region) => {

            // 리에 대한 검색
            if (region.re) {
              // 메인 상단 대표 검색된 키워드
              regionSpan.textContent = `${region.re}`;

              // 상세 주소
              const regionText = document.createTextNode(
                `${region.sido} ${region.sigungu} ${region.eup_myeon_re_dong} ${region.re}`
              );

              // Span 태그(메인 상단 키워드), 일반 Text (상세 주소) Div에 추가
              // 이후 List에 만들어진 Div 추가
              regionDiv.appendChild(regionSpan);
              regionDiv.appendChild(regionText);
              searchListBox.appendChild(regionDiv);

              // 읍면리동에 대한 검색
            } else if (region.eup_myeon_re_dong && !region.re) {
              regionSpan.textContent = `${region.eup_myeon_re_dong}`;

              const regionText = document.createTextNode(
                `${region.sido} ${region.sigungu} ${region.eup_myeon_re_dong}`
              );

              regionDiv.appendChild(regionSpan);
              regionDiv.appendChild(regionText);
              searchListBox.appendChild(regionDiv);

              // 읍면동구에 대한 검색
            } else if (
              region.eup_myeon_dong_gu &&
              !region.eup_myeon_re_dong &&
              !region.re
            ) {
              regionSpan.textContent = `${region.eup_myeon_dong_gu}`;

              const regionText = document.createTextNode(
                `${region.sido} ${region.sigungu}`
              );

              regionDiv.appendChild(regionSpan);
              regionDiv.appendChild(regionText);
              searchListBox.appendChild(regionDiv);
            }

            // 시군구에 대한 검색
            else if (
              region.sigungu &&
              !region.eup_myeon_dong_gu &&
              !region.eup_myeon_re_dong &&
              !region.re
            ) {
              regionSpan.textContent = `${region.sigungu}`;

              const regionText = document.createTextNode(
                `${region.sido} ${region.sigungu}`
              );

              regionDiv.appendChild(regionSpan);
              regionDiv.appendChild(regionText);
              searchListBox.appendChild(regionDiv);
            }

            // 시도에 대한 검색
            else if (
              region.sido &&
              !region.sigungu &&
              !region.eup_myeon_dong_gu &&
              !region.eup_myeon_re_dong &&
              !region.re
            ) {
              regionSpan.textContent = `${region.sido}`;

              const regionText = document.createTextNode(`${region.sido}`);

              regionDiv.appendChild(regionSpan);
              regionDiv.appendChild(regionText);
              searchListBox.appendChild(regionDiv);
            }
          });
        })
        .catch((err) => {
          console.log("API 호출 오류:", err);
        });
    } else if (inputValue.length === 0) {
      // 2글자 미만일 때 active 클래스를 제거하고, display를 none으로 설정
      searchListBox.classList.remove(style.active);
      searchListBox.style.display = "none";
    }
  };

  return (
    <div>
      {/* {" "} */}
      {/* className="container"*/}
      <div className={style.home_top}>
        <div>방 찾기</div>
        <div>찜한 매물</div>
        <div>방 내놓기(전월세만)</div>
      </div>
      <div className={style.main_box}>
        <div className={style.home_body_map}>
          <div className={style.home_body_map_main}>
            {mapRendered && (
              <Map
                center={{ lat: 36.84142696925057, lng: 127.14542099214732 }}
                style={{ width: "100%", height: "100%" }}
                level={zoomLevel}
                onDragEnd={handleDragEnd}
                onZoomChanged={handleZoomChanged}
              >
                <MarkerClusterer
                  averageCenter={true}
                  minLevel={1}
                  calculator={[1, 2, 5]}
                  styles={[
                    {
                      // calculator 각 사이 값 마다 적용될 스타일을 지정한다
                      width: "30px",
                      height: "30px",
                      background: "rgba(51, 204, 255, .8)",
                      borderRadius: "15px",
                      color: "#000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "31px",
                    },
                    {
                      width: "40px",
                      height: "40px",
                      background: "rgba(255, 153, 0, .8)",
                      borderRadius: "20px",
                      color: "#000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "41px",
                    },
                    {
                      width: "50px",
                      height: "50px",
                      background: "rgba(255, 51, 204, .8)",
                      borderRadius: "25px",
                      color: "#000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "51px",
                    },
                    {
                      width: "60px",
                      height: "60px",
                      background: "rgba(255, 80, 80, .8)",
                      borderRadius: "30px",
                      color: "#000",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "61px",
                    },
                  ]}
                >
                  {mapList.map((marker, index) => (
                    <MapMarker
                      key={index}
                      position={{ lat: marker.latitude, lng: marker.longitude }}
                      options={{ title: marker.title }}
                      onClick={() => handleMarkerClick(marker)}
                    />
                  ))}
                </MarkerClusterer>
              </Map>
            )}
          </div>
          {/* 검색창 */}
          <div className={style.home_body_map_search}>
            <div className={style.search_box}>
              {/* 검색 텍스트 입력 */}
              <input
                type="text"
                placeholder="지역, 지하철역, 학교 검색"
                value={searchValue}
                onChange={handleInputChange}
              ></input>

              {/* 검색창 리스트 X 아이콘 위치 설정 (display:none) */}
              <button>X</button>

              {/* 아이콘 */}
              <div className={style.search_icon}>ㅇ</div>
            </div>

            {/* 검색 옵션 선택 */}
            <div className={style.search_option}>
              <div>전월세 (~40만)</div>
              <div>구조 ･ 면적</div>
              <div>옵션</div>
            </div>
          </div>

          {/* 검색창 리스트 박스 위치 설정 (display:none) */}
          <div className={style.search_list_box} ref={searchListBoxRef}>
            {/* 검색창 리스트 세부박스 아래와 같이 세팅할것 */}
          </div>
        </div>

        <div className={style.home_body_side}>
          <Routes>
            <Route path="list/*" element={<List />} />
            <Route path="info/*" element={<Info />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default OneRoom;
