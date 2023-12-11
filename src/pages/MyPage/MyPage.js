import { useState, useEffect } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import style from "./css/MyPage.module.css"
import DeleteMyInfo from './DeleteMyInfo';
import UpdateMyInfo from './UpdateMyInfo';
import ChangePw from './ChangePw';

const Info = () => {
    const storedLoginId = sessionStorage.getItem('loginId');

    const [info, setInfo] = useState([{}]);

    useEffect(() => {
        axios.get("/api/member/myInfo/" + storedLoginId).then(resp => {
            setInfo(resp.data);
        });
    }, []);

    return (
        <div className={style.infoContainer}>
            <div className={style.infoBox}>
                <div className={style.leftInfo}>
                    아이디<br></br>이름<br></br>이메일<br></br>폰번호<br></br>우편번호<br></br>주소
                </div>
                <div className={style.rightInfo}>
                    {storedLoginId}<br></br>
                    {info.name}<br></br>
                    {info.email}<br></br>
                    {info.phone}<br></br>
                    {info.zipcode}<br></br>
                    {info.address1} {info.address2}
                </div>
                <div className={style.cBtnBox}>
                    <Link to="/mypage/changePw"><button className={style.changeBtn}>비밀번호 변경하기</button></Link>
                    <Link to="/mypage/updateMyInfo"><button className={style.changeBtn}>회원정보 수정하기</button></Link>
                    <Link to="/mypage/deleteMyInfo"><button className={style.changeBtn}>회원 탈퇴하기</button></Link>
                </div>
            </div>
        </div>
    );
}

const Jjim = () => {
    return (
        <div className={style.JjimContainer}>
            찜이다.
        </div>
    );
}

const Review = () => {
    return (
        <div className={style.ReviewContainer}>
            리뷰다.
        </div>
    );
}

function MyPage() {
    const [initialRender, setInitialRender] = useState(true);

    const [selectedMenu, setSelectedMenu] = useState("info");

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    return (
        <div className={style.container}>
            <div className={style.menu}>
                <Link to="/mypage/info">
                    <button className={selectedMenu === "info" ? style.menuInfoSelected : style.menuInfo} onClick={() => handleMenuClick("info")}>내 정보</button>
                </Link>
                <Link to="/mypage/jjim">
                    <button className={selectedMenu === "jjim" ? style.menuJjimSelected : style.menuJjim} onClick={() => handleMenuClick("jjim")}>내 찜</button>
                </Link>
                <Link to="/mypage/review">
                    <button className={selectedMenu === "review" ? style.menuReviewSelected : style.menuReview} onClick={() => handleMenuClick("review")}>내 리뷰</button>
                </Link>
            </div>
            <Routes>
                {initialRender && <Route path="/" element={<Info />} />} {/* 처음 렌더링 시에만 Info 컴포넌트를 보임 */}
                <Route path="info" element={<Info />} />
                <Route path="jjim" element={<Jjim />} />
                <Route path="review" element={<Review />} />
                <Route path="deleteMyInfo" element={<DeleteMyInfo />} />
                <Route path="updateMyInfo" element={<UpdateMyInfo />} />
                <Route path="changePw" element={<ChangePw />} />
            </Routes>
        </div>

    );
}

export default MyPage;