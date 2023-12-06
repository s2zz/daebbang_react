import style from "./TopForm.module.css"
import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import logo from "../Enrollment/assets/logo.png";

const TopForm = () => {

    
  return (
    <div className={style.container}>
        <div className={style.top}>
            <div className={style.logo_wrap}>
            <Link to="/"><img src={logo} alt="..." /> </Link>
            </div>

            <div className={style.gnb}>
                <ul className={style.gnb_container}>
                    <li className={style.has_d2}>
                        <a>
                            <Link to="/main"><span>원룸</span></Link>
                        </a>
                        <div className={style.depth2_bx}>
                            <a href="#">방찾기</a>
                            <a href="#">찜한매물</a>
                            <a href="#">방내놓기(전월세만)</a>
                        </div>
                    </li>
                    <li className={style.has_d2}>
                        <a>
                        <Link to="/board"> <span>게시판</span></Link>
                        </a>
                        <div className={style.depth2_bx}>
                            <a href="#">자유게시판</a>
                            <a href="#">양도게시판</a>
                            <a href="#">작성하기</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div className={style.top_btn}>
                <div className="top_btn_menu">
                    <Button><Link to="/login">로그인 및 회원가입</Link></Button>
                </div>
                <div className="top_btn_menu">
                    <Button><Link to="/enrollment">중개사무소 가입</Link></Button>
                </div>
            
            </div>
       
    </div>
    </div>
  );
};

export default TopForm;
