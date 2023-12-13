import style from "./Main.module.css"
import { BrowserRouter } from 'react-router-dom';
import homeimg from "../Enrollment/assets/homeimg.jpg";
import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { faYoutube, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from 'react';
import axios from 'axios';
import Footer from "../commons/Footer";

const Main = () => {
  useEffect(() => {
    const checkTodayVisitor = async () => {
      try {
        const visited = localStorage.getItem('visited');
        if (visited !== 'true') {
          const response = await axios.get('/api/admin/todayVisitor');

          if (!response.data) {
            localStorage.setItem('visited', 'false');
            await axios.post('/api/admin/createVisitor');
            localStorage.setItem('visited', 'true');
          } else {
            await axios.put(`/api/admin/incrementVisitor/${response.data.seq}`);
            localStorage.setItem('visited', 'true');
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    checkTodayVisitor();
  }, []);





  return (
    <div className={style.container}>
      <div className={style.imgbox}>
        <img className={style.homeimg} src={homeimg} alt="..." />
        <div className={style.overlay_text}>어떤 방을 찾으세요?</div>
      </div>
      <div className={style.middlebox}>
        <div className={style.middle_up}>
          <div className={style.recent_read}>
            여기는 최근 본 매물
            <hr></hr>
          </div>

        </div>
        <div className={style.middle_down}>
          <div className={style.recent_estate}>
            여기는 최근 등록된 매물
            <hr></hr>
          </div>
          <div className={style.freeboard}>
            여기는 최근 등록된 양도 게시판 목록
            <hr></hr>
          </div>
          <div className={style.board}>
            여기는 최근 등록된 자유 게시판 목록
            <hr></hr>
          </div>
        </div>
      </div>


      <Footer></Footer>
    </div>

  );
}
export default Main;