import style from "./Footer.module.css"
import { faBlog } from "@fortawesome/free-solid-svg-icons";
import { faYoutube,faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
      return (
          <div className={style.container}>
              
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
  export default Footer;