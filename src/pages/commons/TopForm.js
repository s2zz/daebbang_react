import style from "./TopForm.module.css"
import * as React from 'react';
import Button from '@mui/material/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from "react";
import logo from "../Enrollment/assets/logo3.png";
import axios from 'axios';
import style1 from "../commons/Modal.module.css";
import { Modal, ModalBody, } from 'reactstrap';

const TopForm = ({ setLoginId }) => {

    const navi = useNavigate();
    const location = useLocation();

    const storedLoginId = sessionStorage.getItem('loginId');
    const isAdmin = sessionStorage.getItem('isAdmin');
    const isEstate = sessionStorage.getItem('isEstate');

    const toggle3 = () => {
        alert("준비중인 기능입니다");
    }
    const handleLogout = () => {
        axios.get("/api/member/logout").then(resp => {
            sessionStorage.removeItem('loginId');
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('isEstate');
            navi("/");
            window.location.reload();
            setLoginId = null;
        }).catch(resp => {
            alert("로그아웃에 실패했습니다.")
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
                });
        }
    }, [isEstate, storedLoginId, location.pathname]);


    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {reviewCount}개의 확인하지 않은<br /> 문의가 있습니다!
        </Tooltip>
    );
    return (
        <div className={style.container}>
            <div className={style.top}>
                <div className={style.logo_wrap}>
                    <Link to="/"><img src={logo} alt="..." className={style.logo} /> </Link>
                </div>

                <div className={style.gnb}>
                    <ul className={style.gnb_container}>
                        <li className={style.has_d2}>
                            <Link to="/home/oneroom/list"><Button><span>원룸</span></Button> </Link>
                            <div className={style.depth2_bx}>
                                <Link to="/home/oneroom/list">방찾기</Link>
                            </div>
                        </li>
                        <li className={style.has_d2}>
                            <Link to="#"><Button onClick={toggle3}><span>투룸</span></Button> </Link>
                        </li>
                        <li className={style.has_d2}>
                            <Link to="#"><Button onClick={toggle3}><span>오피스텔</span></Button> </Link>
                        </li>
                        <li className={style.has_d2}>
                            <Link to="board"><Button><span>게시판</span></Button> </Link>
                            <div className={style.depth2_bx}>
                                <Link to="/board/toFavoriteBoardList">즐겨찾기</Link>
                                <Link to="board">자유게시판</Link>
                                <Link to="/board/toRoomBoardList">양도게시판</Link>
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
                                            <Link to="/admin">관리자 페이지</Link>
                                            : <Link to="/myPage">마이페이지</Link>}
                                        {isEstate ?
                                            <>
                                                <Link to="/estateManage">매물관리 {isEstate && reviewCount !== 0 &&
                                                    (<OverlayTrigger placement="bottom" delay={{ show: 250, hide: 400 }} overlay={renderTooltip}>
                                                        <Button sx={{ ml: 5 }}>{reviewCount}</Button>
                                                    </OverlayTrigger>)}</Link>
                                            </>
                                            : ""}
                                        <Link to="#" onClick={handleLogout}>로그아웃</Link>

                                    </div>
                                </li>
                            </ul>
                        </div>
                        : <div className={style.top_btn_menu}> <Button><Link to="/login">로그인 및 회원가입</Link></Button></div>}


                    <div className={style.top_right_menu}>
                        {isEstate ? <> </> : <Button><Link to="/enrollment">중개사무소 가입</Link></Button>}

                    </div>

                </div>

            </div>
        </div>
    );
};

export default TopForm;
