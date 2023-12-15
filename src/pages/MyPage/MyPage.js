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
    const storedLoginId = sessionStorage.getItem('loginId');
    const [estate, setEstate] = useState([{}]);
    const [sawEstate, setSawEstate] = useState([{}]);

    useEffect(() => {
        axios.get(`/api/reviewApproval/myReview/${storedLoginId}`).then(resp => {
            setSawEstate(resp.data);
            for(let i=0;i<sawEstate.length;i++) {
                console.log(sawEstate[i].estateCode);
            }
        });
        // 전체목록 가져오기 - promise 객체 반환 대기중
        // 화면 구성과 관련없는 side effect 기능들을 실행하는 것들을 통ㅈㅔ하기 위해 useeffect 사용
        // re랜더링 시점에는 useEffect가 실행되지 않는다
    }, []);

    return (
        <div className={style.ReviewContainer}>
            {sawEstate.map((e, i) => {
                return (
                    <tr key={i}>
                        {e.seq}
                        {e.userId}
                        {e.estateCode}
                        {e.approvalCode}
                        {e.write_date}
                    </tr>
                )
            })}
        </div>
    );
}


const EstateInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');

    const [info, setInfo] = useState([{}]);

    useEffect(() => {
        axios.get("/api/estate/estateInfo/" + storedLoginId).then(resp => {
            setInfo(resp.data);
        });
    }, []);

    return (
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
    );
}

function MyPage() {
    const [initialRender, setInitialRender] = useState(true);

    const isEstate = sessionStorage.getItem('isEstate');

    const [selectedMenu, setSelectedMenu] = useState("info");

    const handleMenuClick = (menu) => {
        setSelectedMenu(menu);
    };

    return (
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
                    <Link to="/mypage/jjim">
                        <button className={selectedMenu === "jjim" ? style.menuJjimSelected : style.menuJjim} onClick={() => handleMenuClick("jjim")}>내 찜</button>
                    </Link>
                    <Link to="/mypage/review">
                        <button className={selectedMenu === "review" ? style.menuReviewSelected : style.menuReview} onClick={() => handleMenuClick("review")}>내가 본 방</button>
                    </Link>
                </div>
            }
            <Routes>
                {initialRender && !isEstate && <Route path="/" element={<Info />} />} {/* 처음 렌더링 시에만 Info 컴포넌트를 보임 */}
                <Route path="info" element={<Info />} />
                <Route path="jjim" element={<Jjim />} />
                <Route path="review" element={<Review />} />
                <Route path="deleteMyInfo" element={<DeleteMyInfo />} />
                <Route path="updateMyInfo" element={<UpdateMyInfo />} />
                <Route path="changePw" element={<ChangePw />} />

                {initialRender && isEstate && <Route path="/" element={<EstateInfo />} />}
                <Route path="estateInfo" element={<EstateInfo />} />
            </Routes>
        </div>

    );
}

export default MyPage;