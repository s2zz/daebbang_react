import { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import style from "./css/MyPage.module.css"
import DeleteMyInfo from './DeleteMyInfo';
import UpdateMyInfo from './UpdateMyInfo';
import ChangePw from './ChangePw';
import Loading from '../commons/Loading';
import Footer from "../commons/Footer";

const Info = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState([{}]);

    useEffect(() => {
        axios.get("/api/member/myInfo/" + storedLoginId).then(resp => {
            setInfo(resp.data);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? <Loading></Loading> :
                <div className={style.infoContainer}>
                    <div className={style.infoBox}>
                        <div className={style.leftInfo}>
                            ID<br></br>NAME<br></br>E-MAIL<br></br>PHONE<br></br>ZIPCODE<br></br>ADDRESS
                        </div>
                        <div className={style.rightInfo}>
                            {storedLoginId}<br></br>
                            {info.name}<br></br>
                            {info.email}<br></br>
                            {info.phone}<br></br>
                            {info.zipcode}<br></br>
                            {info.address1} {info.address2}
                        </div>
                    </div>
                    <div className={style.cBtnBox}>
                        <Link to="/mypage/changePw"><button className={style.changeBtn}>비밀번호 변경하기</button></Link>
                        <Link to="/mypage/updateMyInfo"><button className={style.changeBtn}>회원정보 수정하기</button></Link>
                        <Link to="/mypage/deleteMyInfo"><button className={style.changeBtn}>회원 탈퇴하기</button></Link>
                    </div>
                </div>
            }
        </div>
    );
}

const Review = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const [loading, setLoading] = useState(true);
    const [sawEstate, setSawEstate] = useState([{}]);

    useEffect(() => {
        axios.get("/api/reviewApproval/sawEstate/" + storedLoginId).then(resp => {
            setSawEstate(resp.data);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? <Loading></Loading> :
                <div className={style.ReviewContainer}>
                    {sawEstate.length > 0 ?
                        <div>
                            {sawEstate.map((e, i) => {
                                const address = e.address || '';
                                const title = e.title || '';
                                return (
                                    <div key={i} className={style.SawEstate}>
                                        <img src={`uploads\\estateImages\\${e.img}`} alt="Estate Image"></img>
                                        <div className={style.sawAddress}>{address.length > 30 ? address.substring(0, 30) + "..." : address}</div>
                                        <div className={style.sawTitle}>{title.length > 15 ? title.substring(0, 15) + "..." : title}</div>
                                        {e.approvalCode === 'a1' || e.approvalCode === 'a2' ? <button className={style.waitBtn}>승인 대기</button> : null}
                                        {e.approvalCode === 'a3' ? <Link to="/review/writeReview" state={{ estateCode: e.estateId, approvalCode: e.approvalCode }}><button className={style.writeReviewBtn}>리뷰 작성</button></Link> : null}
                                        {e.approvalCode === 'a4' || e.approvalCode === 'b1' ? <button className={style.refuseBtn}>승인 거절</button> : null}
                                        {e.approvalCode === 'a5' ? <button className={style.waitBtn}>작성 완료</button> : null}
                                    </div>
                                )
                            })}
                        </div>
                        : <div className={style.notSawYet}>아직 방을 구경하지 않았어요</div>}
                </div>
            }
        </div>
    );
}

const Report = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const [loading, setLoading] = useState(true);
    const [myReport, setMyReport] = useState([{}]);

    useEffect(() => {
        axios.get("/api/report/myReport/" + storedLoginId).then(resp => {
            setMyReport(resp.data);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? <Loading></Loading> :
                <div className={style.ReportContainer}>
                    {myReport.length > 0 ?
                        <div>
                            {myReport.map((e, i) => {
                                return (
                                    <div key={i} className={style.SawEstate}>
                                        <div className={style.estateName}>{e.estateName}</div>
                                        <div className={style.content}>{e.content}</div>
                                        <div className={style.content2}>{e.content2}</div>
                                        <div className={style.status}>{e.status}</div>
                                    </div>
                                )
                            })}
                        </div>
                        : <div className={style.notSawYet}>신고 내역이 없습니다</div>}
                </div>
            }
        </div>
    );
}

const EstateInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState([{}]);

    useEffect(() => {
        axios.get("/api/estate/estateInfo/" + storedLoginId).then(resp => {
            setInfo(resp.data);
            setLoading(false);
        });
    }, []);

    return (
        <div>
            {loading ? <Loading></Loading> :
                <div className={style.infoContainer}>
                    <div className={style.infoBox}>
                        <div className={style.eleftInfo}>
                            ID<br></br>ESTATE NAME<br></br>ESTATE NUMBER<br></br>NAME<br></br>PHONE<br></br>ADDRESS<br></br>MANNER TEMPERATURE
                        </div>
                        <div className={style.rightInfo}>
                            {storedLoginId}<br></br>
                            {info.estateName}<br></br>
                            {info.estateNumber}<br></br>
                            {info.name}<br></br>
                            {info.phone}<br></br>
                            {info.address}<br></br>
                            {info.manners_temperature}<br></br>
                        </div>
                    </div>
                    <div className={style.cBtnBox}>
                        <Link to="/mypage/changePw"><button className={style.changeBtn}>비밀번호 변경하기</button></Link>
                        <Link to="/mypage/updateMyInfo"><button className={style.changeBtn}>회원정보 수정하기</button></Link>
                        <Link to="/mypage/deleteMyInfo"><button className={style.changeBtn}>회원 탈퇴하기</button></Link>
                    </div>
                </div>
            }
        </div>
    );
}

function MyPage() {
    const isEstate = sessionStorage.getItem('isEstate');

    const [selectedMenu, setSelectedMenu] = useState("");

    // Set selectedMenu based on the current URL
    useEffect(() => {
        const currentPath = window.location.pathname;
        const menuFromPath = getMenuFromPath(currentPath);
        setSelectedMenu(menuFromPath);
    }, []);

    // Helper function to get menu from the URL path
    const getMenuFromPath = (path) => {
        // You may need to adjust this logic based on your URL structure
        if (path.includes('review')) {
            return 'review';
        } else if (path.includes('estateInfo')) {
            return 'estateInfo';
        } else if (path.includes('report')) {
            return 'report';
        }
        // Default to 'info' if no match is found
        return 'info';
    };

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    return (
        <div>
            <div className={style.container}>
                <div className={style.myLogo}>MY DAEBBANG</div>
                {isEstate ?
                    <div className={style.menuDiv}>
                        <div className={style.menu}>
                            <Link to="/mypage/estateInfo">
                                <button className={selectedMenu === "info" ? style.menuInfoSelected : style.menuInfo} onClick={() => handleMenuClick("info")}>내 정보</button>
                            </Link>
                        </div>
                    </div>
                    : <div className={style.menu}>
                        <Link to="/mypage/info">
                            <button className={selectedMenu === "info" ? style.menuInfoSelected : style.menuInfo} onClick={() => handleMenuClick("info")}>내 정보</button>
                        </Link>
                        <Link to="/mypage/review">
                            <button className={selectedMenu === "review" ? style.menuReviewSelected : style.menuReview} onClick={() => handleMenuClick("review")}>내가 본 방</button>
                        </Link>
                        <Link to="/mypage/report">
                            <button className={selectedMenu === "report" ? style.menuReportSelected : style.menuReport} onClick={() => handleMenuClick("report")}>신고 내역</button>
                        </Link>
                    </div>
                }
                <Routes>
                    {!isEstate && <Route path="/" element={<Info />} />}
                    <Route path="info" element={<Info />} />
                    <Route path="review" element={<Review />} />
                    <Route path="report" element={<Report />} />
                    <Route path="deleteMyInfo" element={<DeleteMyInfo />} />
                    <Route path="updateMyInfo" element={<UpdateMyInfo />} />
                    <Route path="changePw" element={<ChangePw />} />

                    {isEstate && <Route path="/" element={<EstateInfo />} />}
                    <Route path="estateInfo" element={<EstateInfo />} />
                </Routes>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default MyPage;