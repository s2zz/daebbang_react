import style from "./Main.module.css"
import homeimg from "../Enrollment/assets/homeimg.jpg";
import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { faYoutube,faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from 'react';
import axios from 'axios';

const Main = () => {
    useEffect(() => {
        // 페이지 로드 시 오늘 날짜 데이터 확인 후 방문자 수 증가 요청
        axios.get('/api/admin/todayVisitor')
          .then(response => {
      
            if (response.data) {
              console.log('Data exists:', response.data.seq);
              // 해당 데이터의 방문자 수 증가 요청 (PUT 요청)
              axios.put(`/api/admin/incrementVisitor/${response.data.seq}`)
                .then(resp => {
                  console.log('Visitor count incremented for today');
                })
                .catch(error => {
                  console.error('Error incrementing visitor count:', error);
                });
            } else {
              console.log('Data does not exist:', response.data);
              // 오늘 날짜의 데이터가 없는 경우 새로운 데이터 삽입 (POST 요청)
              axios.post('/api/admin/createVisitor')
                .then(resp => {
                  console.log('New visitor entry created for today');
                })
                .catch(error => {
                  console.error('Error creating new visitor entry:', error);
                });
            }
          })
          .catch(error => {
            console.error('Error checking today\'s visitor data:', error);
          });
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
            <div className={style.footerbox}>
                <div className={style.footer}>
                    <div className={style.linkbox}>
                        <a href="#">회사소개</a> | <a href="#">이용약관</a> | <a className={style.font} href="#"> 개인정보처리방침  </a> | <a href="#">고객센터</a> | <a href="#">제휴문의</a> 
                    </div>
                    <div className={style.footermain}>
                        (주)대빵 | 대표: 이찬양: 사업자등록번호:123-45-67890<br></br>
                        주소: 충청남도 천안시 서북구 천안대로 1223-24 612호(8공학관)(우:31080)<br></br>
                        서비스 이용문의: 1234-5678 | 이메일: db@daebbang.com<br></br>
                        통신판매업 신고번호 : 제2023-천안-00000호<br></br>
                        Hosting by (주)대빵<br></br><br></br>
                        <div className={style.btnbox}>
                           <button><FontAwesomeIcon icon={faYoutube} /></button> <button><FontAwesomeIcon icon={faFacebook}/></button>  <button><FontAwesomeIcon icon={faBlog} /></button> 
                        </div>
                        
                        <div className="copyright">
                        Copyright © DAEBBANG. All Rights Reserved.
                        </div>

                    </div>
                </div>
            </div>
        </div>

    );
}
export default Main;