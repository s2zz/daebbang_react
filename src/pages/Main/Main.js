import style from "./Main.module.css"
import search from "../Home/OneRoom/assets/search.png"
import homeimg from "../Enrollment/assets/homeimg.jpg";
import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Footer from "../commons/Footer";
import ItemsCarousel from 'react-items-carousel';

const Main = () => {
  const [freeboard, setfreeBoard] = useState([]);
  const [roomboard, setroomBoard] = useState([]);
  const [mapList, setMapList] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;
  const [watch, setwatch] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const searchListBoxRef = useRef(null);

  const navigate = useNavigate();




  



  useEffect(() => {
    axios.get(`/api/map/getLimitAll`).then((resp) => {
      setMapList(resp.data);
    })
      .catch((err) => {
      })
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem('watch');
    const recent = JSON.parse(storedData);
    if (recent == null) {
      return
    }
    else {
      axios.get(`/api/map/getWatchAll/${recent}`).then(resp => {
        setwatch(resp.data);
      }).catch(err => {
      })
    }
  }, []);
  useEffect(() => {
    const storedData = localStorage.getItem('watch');
    const recent = JSON.parse(storedData);
    if (recent == null) {
      return
    }
    else {
      axios.get(`/api/map/getImageAll/${recent}`).then(resp => {
        setImageList(resp.data);
      }).catch(err => {
      })
    }
  }, []);
  // 내림차순 정렬
  function compareBySeq(a, b) {
    return b.seq - a.seq;
  }

  // 게시글 목록 불러오기
  useEffect(() => {
    axios.get(`/api/board/limitFreeBoardList`).then(resp => {
      setfreeBoard(resp.data.sort(compareBySeq));
    })
  }, []);
  useEffect(() => {
    axios.get(`/api/board/limitRoomBoardList`).then(resp => {
      setroomBoard(resp.data.sort(compareBySeq));
    })
  }, [])

  // 페이지네이션
  const currentPage = 1;
  const countPerPage = 10;
  const sliceRoomContentsList = () => {
    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;
    return roomboard.slice(start, end);
  }
  const sliceFreeContentsList = () => {
    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;
    return freeboard.slice(start, end);
  }
  const handleInputChange = (event) => {
    // 받은 데이터의 길이 (2글자 이상인지 체크)
    const inputValue = event.target.value;
    setSearchValue(inputValue);

    // 리스트 박스를 찾기 위해서 쓰는 Ref
    const searchListBox = searchListBoxRef.current;

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
          searchListBox.innerHTML = ""; // 기존 내용을 초기화

          // 검색된 데이터가 없을때
          if (
            resp.data.regionList.length === 0 &&
            resp.data.subwayList.length === 0 &&
            resp.data.schoolList.length === 0
          ) {
            // NULL 값일때 List에 넣을 CSS를 사용하기 위해 만드는 마크업
            const nullRegionSpan = document.createElement("span");
            const nullRegionDiv = document.createElement("div");

            nullRegionSpan.textContent = `검색된 항목이 없습니다.`;
            nullRegionDiv.appendChild(nullRegionSpan);
            searchListBox.appendChild(nullRegionDiv);
          }

          // 각 지역에 대한 검색
          // region에는 각 지역 정보가 들어 있음
          resp.data.regionList.forEach((region) => {
            // List에 넣을 CSS를 사용하기 위해 만드는 마크업
            const regionSpan = document.createElement("span");
            const regionDiv = document.createElement("div");

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

            // 클릭 이벤트 리스너 추가
            /* regionDiv.addEventListener("click", () => {
              moveToLocation(region);
            });*/
          });

          // 지하철역에 대한 검색
          // subway 각 지역 정보가 들어 있음
          // 지도 이동 이벤트
          resp.data.subwayList.forEach((subway) => {
            const subwaySpan = document.createElement("span");
            const subwayDiv = document.createElement("div");

            subwaySpan.textContent = subway.name;
            const subwayText = document.createTextNode(subway.address);

            subwayDiv.appendChild(subwaySpan);
            subwayDiv.appendChild(subwayText);
            searchListBox.appendChild(subwayDiv);


          });

          // 대학교에 대한 검색
          // subway 각 지역 정보가 들어 있음
          resp.data.schoolList.forEach((school) => {
            // List에 넣을 CSS를 사용하기 위해 만드는 마크업
            const subwaySpan = document.createElement("span");
            const subwayDiv = document.createElement("div");

            // 메인 상단 대표 검색된 키워드
            subwaySpan.textContent = `${school.name}`;

            // 상세 주소
            const subwayText = document.createTextNode(`${school.address}`);

            // Span 태그(메인 상단 키워드), 일반 Text (상세 주소) Div에 추가
            // 이후 List에 만들어진 Div 추가
            subwayDiv.appendChild(subwaySpan);
            subwayDiv.appendChild(subwayText);
            searchListBox.appendChild(subwayDiv);


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
  const handleImageClick = (i) => {
    navigate("/home/oneroom", { state: watch[i] });
    // 로컬 스토리지에서 현재 감시 중인 속성 가져오기
    const storedData = localStorage.getItem("watch");
    const watchedProperties = storedData ? JSON.parse(storedData) : [];

    // 새로운 마커의 estateId를 감시 중인 속성에 추가
    const updatedWatchedProperties = [
      ...new Set([watch[i].estateId, ...watchedProperties]),
    ];
    // 감시 중인 속성을 최대 10개로 제한
    if (updatedWatchedProperties.length > 10) {
      updatedWatchedProperties.splice(10);
    }
    // 갱신된 감시 중인 속성을 로컬 스토리지에 저장
    localStorage.setItem("watch", JSON.stringify(updatedWatchedProperties));
  };
  const handleEstateClick = (i) => {
    navigate("/home/oneroom", { state: mapList[i] });

    // 로컬 스토리지에서 현재 감시 중인 속성 가져오기
    const storedData = localStorage.getItem("watch");
    const watchedProperties = storedData ? JSON.parse(storedData) : [];

    // 새로운 마커의 estateId를 감시 중인 속성에 추가
    const updatedWatchedProperties = [
      ...new Set([mapList[i].estateId, ...watchedProperties]),
    ];
    // 감시 중인 속성을 최대 10개로 제한
    if (updatedWatchedProperties.length > 10) {
      updatedWatchedProperties.splice(10);
    }
    // 갱신된 감시 중인 속성을 로컬 스토리지에 저장
    localStorage.setItem("watch", JSON.stringify(updatedWatchedProperties));
  };






  return (
    <div className={style.container}>
      {watch.length > 0 ? <div className={style.recent}>
        <div className={style.recentbox}>
          <div className={style.saw_estate}>
            <div className={style.sawdiv}>
              최근 본 매물
              <hr />
            </div>
            <ItemsCarousel
              requestToChangeActive={setActiveItemIndex}
              activeItemIndex={activeItemIndex}
              numberOfCards={1}
              gutter={10}
              leftChevron={<button
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  fontSize: "15px",
                  border: "none",
                  transform: "scaleX(1.1)",
                  marginRight: "5px",
                }}
              >{'<'}</button>}
              rightChevron={<button
                style={{
                  backgroundColor: "transparent",
                  color: "black",
                  fontSize: "15px",
                  border: "none",
                  transform: "scaleX(1.1)",
                  marginLeft:"5px"
                }}
              >{'>'}</button>}
              outsideChevron={false}
              chevronWidth={chevronWidth}
            >
              {imageList.map((e, i) => {
                return (
                  <div key={i} onClick={() => handleImageClick(i)} className={style.imagediv}  >
                    <img
                      className={style.sawImage}
                      src={`/uploads/estateImages/${e}`}
                      alt="Estate"
                    />
                  </div>
                );
              })}

            </ItemsCarousel>
          </div>
        </div>
      </div> : <></>}


      <div className={style.imgbox}>
        <img className={style.homeimg} src={homeimg} alt="..." />
        <div className={style.overlay_text}>어떤 방을 찾으세요?</div>
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
            <div className={style.search_icon}>
              <img
                style={{ maxHeight: "25px" }}
                src={search}
                alt="exam icon"
              />
            </div>

          </div>
        </div>

        <div className={style.search_list_box} ref={searchListBoxRef}>
        </div>
      </div>
      <div className={style.middlebox}>
        <div className={style.middle_down}>
          <div className={style.recent_estate}>
            <div className={style.titlebox}>
              <span className={style.title}> 최근 등록된 매물</span>
              <a href="/home/oneroom"><span className={style.morebtnspan}><button className={style.morebtn}>더보기</button></span></a>
            </div>
            <hr></hr>
            <div className={style.contents}>
              {
                mapList.map((e, i) => {
                  return (
                    <div className={style.cbgdiv} key={i} onClick={() => handleEstateClick(i)} >
                      <span className={style.fontcss}>
                        [{e.address2.length > 7 ? e.address2.substring(0, 7) : e.address2}]
                      </span>
                      <span className={style.fontcss}>
                        {e.title.length > 7 ? e.title.substring(0, 7) + "..." : e.title}
                      </span>
                      <span style={{ float: "right" }} className={style.datefontcss}>{e.writeDate.substring(0, 10)}</span>
                    </div>
                  );
                })
              }
            </div>
          </div>
          <div className={style.freeboard}>
            <div className={style.titlebox}>
              <span className={style.title}>양도 게시판</span>
              <a href="/board/toRoomBoardList"><span className={style.morebtnspan}><button className={style.morebtn}>더보기</button></span></a>
            </div>
            <hr></hr>
            <div className={style.contents}>
              {
                sliceRoomContentsList().map((e, i) => {
                  return (
                    <Link key={i} to={`/board/toRoomBoardContents`} style={{ textDecoration: "none", color: "black" }} state={{ sysSeq: e.seq }}>
                      <div className={style.cbgdiv} data-seq={e.seq}>
                        <span className={style.fontcss}>
                          [{e.header}]
                        </span>
                        <span className={style.fontcss}>
                          {e.title.length > 9 ? e.title.substring(0, 9) + "..." : e.title}
                        </span>
                        <span style={{ float: "right" }} className={style.datefontcss}>{e.writeDate.split("T")[0]}</span>
                      </div>
                    </Link>
                  );
                })
              }
            </div>
          </div>
          <div className={style.board}>
            <div className={style.titlebox}>
              <span className={style.title}>자유 게시판</span>

              <a href="/board/toFreeBoardList"><span className={style.morebtnspan}><button className={style.morebtn}>더보기</button></span></a>
            </div>
            <hr></hr>
            <div className={style.contents}>
              {
                sliceFreeContentsList().map((e, i) => {
                  return (
                    <Link key={i} to={`/board/toFreeBoardContents/${(countPerPage * (currentPage - 1)) - i}`} style={{ textDecoration: "none", color: "black" }} state={{ oriSeq: freeboard.length - (i), sysSeq: e.seq }}>
                      <div className={style.cbgdiv} data-seq={e.seq}>
                        <span className={style.fontcss}>[자유]  </span>
                        <span className={style.fontcss}>
                          {e.title.length > 13 ? e.title.substring(0, 10) + "..." : e.title}
                        </span>
                        <span style={{ float: "right" }} className={style.datefontcss}>{e.writeDate.split("T")[0]}</span>
                      </div>
                    </Link>
                  );
                })
              }
            </div>
          </div>
        </div>
        <div middle_up="true">
          <Footer></Footer>
        </div>
      </div>
    </div>

  );
}
export default Main;