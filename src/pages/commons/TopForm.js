import style from "./TopForm.module.css"
import * as React from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import logo from "../Enrollment/assets/logo2.png";
import axios from 'axios';

const TopForm = ({ setLoginId }) => {

    const navi = useNavigate();
    const location = useLocation();

    const storedLoginId = sessionStorage.getItem('loginId');
    const isAdmin = sessionStorage.getItem('isAdmin');
    const isEstate = sessionStorage.getItem('isEstate');
    const handleLogout = () => {
        axios.get("/api/member/logout").then(resp => {
            console.log("로그아웃 완료");
            sessionStorage.removeItem('loginId');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('isEstate');
            navi("/");
            window.location.reload();
            setLoginId = null;
        }).catch(resp => {
            console.log(resp);
        })
    }

    const [reviewCount, setReviewCount] = useState(null);

    useEffect(() => {
        if (isEstate) {
            axios.get(`/api/reviewApproval/agentReview/count/${storedLoginId}`)
                .then(resp => {
                    setReviewCount(resp.data);
                })
                .catch(error => {
                    console.error('Error fetching review count:', error);
                });
        }
    }, [isEstate, storedLoginId, location.pathname]);

    const handleready = () =>{
        alert("준비중인 기능입니다.")
    }
    return (
        <div className={style.container}>
            <div className={style.top}>
                <div className={style.logo_wrap}>
                    <Link to="/"><img src={logo} alt="..." /> </Link>
                </div>

                <div className={style.gnb}>
                    <ul className={style.gnb_container}>
                        <li className={style.has_d2}>
                            <a href="/home/oneroom/list"><Button><span>원룸</span></Button> </a>
                            <div className={style.depth2_bx}>
                                <a href="/home/oneroom/list">방찾기</a>
                            </div>
                        </li>
                        <li className={style.has_d2}>
                            <a href="#" onClick={handleready}><Button><span>투룸</span></Button> </a>
                        </li>
                        <li className={style.has_d2}>
                            <a href="#" onClick={handleready}><Button><span>오피스텔</span></Button> </a>
                        </li>
                        <li className={style.has_d2}>
                            <a href="/board"><Button><span>게시판</span></Button> </a>
                            <div className={style.depth2_bx}>
                                <a href="/board/toFavoriteBoardList">즐겨찾기</a>
                                <a href="/board">자유게시판</a>
                                <a href="/board/toRoomBoardList">양도게시판</a>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className={style.top_btn}>

                    {storedLoginId ?
                        <div className={style.gnb}>
                            <ul className={style.gnb_container}>
                                <li className={style.has_d2}>
                                    <Button>{storedLoginId}▼</Button>
                                    <div className={style.depth2_bx}>
                                        {isAdmin ?
                                            <a href="/admin">관리자 페이지</a>
                                            : <a href="/myPage">마이페이지</a>}
                                        {isEstate ?
                                            <>
                                                <a href="/estateManage">매물관리 {isEstate && reviewCount !== 0 && (<Button sx={{ml: 5}}>{reviewCount}</Button>)}</a> 
                                            </>
                                            : ""}
                                        <a href="#" onClick={handleLogout}>로그아웃</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        : <div className={style.top_btn_menu}> <Button><a href="/login">로그인 및 회원가입</a></Button></div>}


                    <div className={style.top_right_menu}>
                        {isEstate ? <> </>: <Button><a href="/enrollment">중개사무소 가입</a></Button>}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default TopForm;
