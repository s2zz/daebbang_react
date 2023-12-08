import { useState, useEffect  } from 'react';
import { Link, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import style from "./MyPage.module.css"

const Info = () => {
    return (
        <div className={style.infoContainer}>
            <div className={style.profile}>프로필사진을 내가 할 수 있을까..</div>
            <div className={style.infoBox}>
                <div>아이디</div>
                <div>이름</div>
                <div>이메일</div>
                <div>폰번호</div>
                <div>집주소</div>
                <button>비밀번호 변경하기</button>
                <button>회원정보 수정하기</button>
                <button>회원 탈퇴하기</button><br></br>
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

    return (
        <div className={style.container}>
            <div className={style.menu}>
                <Link to="/mypage/info"><button className={style.menuInfo}>내 정보</button></Link>
                <Link to="/mypage/jjim"><button className={style.menuJjim}>내 찜</button></Link>
                <Link to="/mypage/review"><button className={style.menuReview}>내 리뷰</button></Link>
            </div>
            <Routes>
                {initialRender && <Route path="/" element={<Info />} />} {/* 처음 렌더링 시에만 Info 컴포넌트를 보임 */}
                <Route path="info" element={<Info />} />
                <Route path="jjim" element={<Jjim />} />
                <Route path="review" element={<Review />} />
            </Routes>
        </div>

    );
}

export default MyPage;