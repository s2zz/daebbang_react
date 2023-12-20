import style from "./Main.module.css"
import homeimg from "../Enrollment/assets/homeimg.jpg";
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
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

  useEffect(() => {
    const storedData = localStorage.getItem('watch');
    const recent = JSON.parse(storedData);
    axios
      .get(`/api/map/getLimitAll`)
      .then((resp) => {
        setMapList(resp.data.sort(compareByestate_id));
      })
      .catch((err) => {
        console.log(err);
      })
      axios.get(`/api/map/getWatchAll/${recent}`).then(resp => {
        setwatch(resp.data);
        console.log(resp.data);
      }).catch(err => {
        console.log(err);
      })
  }, []);
  


  // 내림차순 정렬
  function compareBySeq(a, b) {
    return b.seq - a.seq;
  }
  function compareByestate_id(a, b) {
    return b.estateId - a.estateId;
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
  const [currentPage, setCurrentPage] = useState(1);
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





  return (
    <div className={style.container}>
      <div className={style.imgbox}>
        <img className={style.homeimg} src={homeimg} alt="..." />
        <div className={style.overlay_text}>어떤 방을 찾으세요?</div>
      </div>
      <div className={style.middlebox}>
        <div className={style.middle_up}>
          <div className={style.recent_read}>
            <div className={style.titlebox}>
              <span className={style.title}> 최근 본 매물</span>
            </div>
            <hr></hr>
            <div style={{ padding: `0 ${chevronWidth}px` }}>
              <ItemsCarousel
                requestToChangeActive={setActiveItemIndex}
                activeItemIndex={activeItemIndex}
                numberOfCards={3}
                gutter={20}
                leftChevron={<button>{'<'}</button>}
                rightChevron={<button>{'>'}</button>}
                outsideChevron
                chevronWidth={chevronWidth}
              >{
              watch.map((e, i) => {
                return (
                  <div>
                    <div style={{ height: 200, background: '#EEE' }}>{e.estateId}</div>
                  </div>
                  
                )

              })
              }
                 
                
              </ItemsCarousel>
            </div>
          </div>

        </div>
        <div className={style.middle_down}>
          <div className={style.recent_estate}>
            <div className={style.titlebox}>
              <span className={style.title}> 최근 등록된 매물</span>
              <a href="/home/oneroom/list"><span className={style.morebtnspan}><button className={style.morebtn}>더보기</button></span></a>
            </div>
            <hr></hr>
            <div className={style.contents}>
              {
                mapList.map((e, i) => {
                  return (
                    <Link to={`#`} style={{ textDecoration: "none", color: "black" }} >
                      <div className={style.cbgdiv} key={i}>
                        <span className={style.fontcss}>
                        [{e.address2.length > 7 ? e.address2.substring(0, 7) : e.address2}]
                        </span>
                        <span className={style.fontcss}>
                        {e.title.length > 7 ? e.title.substring(0, 7) + "..." : e.title}
                        </span>
                        <span style={{ float: "right" }} className={style.datefontcss}>{e.writeDate.substring(0, 10)}</span>
                      </div>
                    </Link>
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
                    <Link to={`/board/toRoomBoardContents`} style={{ textDecoration: "none", color: "black" }} state={{ sysSeq: e.seq }}>
                      <div className={style.cbgdiv} key={i} data-seq={e.seq}>
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
                    <Link to={`/board/toFreeBoardContents/${(countPerPage * (currentPage - 1)) - i}`} style={{ textDecoration: "none", color: "black" }} state={{ oriSeq: freeboard.length - (i), sysSeq: e.seq }}>
                      <div className={style.cbgdiv} key={i} data-seq={e.seq}>
                        <span className={style.fontcss}>[자유]  </span>
                        <span className={style.fontcss}>
                          {e.title.length > 13 ? e.title.substring(0, 13) + "..." : e.title}
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
      </div>


      <Footer></Footer>
    </div>

  );
}
export default Main;