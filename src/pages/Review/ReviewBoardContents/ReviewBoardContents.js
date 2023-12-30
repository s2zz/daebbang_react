import style from './ReviewBoardContents.module.css';
import favorites from '../assets/favorites.png';
import notFavorite from '../assets/notFavorite.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../../commons/Loading';
const ReviewBoardContents = ({ loginId, admin }) => {
    const maxScore = 5;
    const location = useLocation();
    const navi = useNavigate();
    const [review, setReview] = useState({});
    const seq = location && location.state && location.state.seq ? location.state.seq : 0;
    const [loading, setLoading] = React.useState(true);

    // 리뷰 내용 불러오기
    useEffect(() => {
        axios.get(`/api/review/selectReviewBySeq/${location.state.seq}`).then(resp => {
            setReview(resp.data);
            setLoading(false);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    // 리뷰 삭제
    const delReview = () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios.delete(`/api/review/${seq}`).then((resp) => {
                alert("리뷰가 삭제되었습니다");
                navi("/review/boardReview", { state: { realEstateNumber: review.realEstateNumber } });
                return;
            }).catch((err) => {
                alert("리뷰 삭제에 실패하였습니다");
                console.log(err);
            });
        }
    };

    const score = review.score ? review.score : 0;
    return (
        <>
            {loading ? <Loading></Loading> : <>
                <div className={style.boardContentsTitle}><span>{review.estateId}번 매물</span>{review.estate ? review.estate.title : ""}</div>
                <div className={style.boardContentsInfo}>
                    <div>
                        리뷰 작성자 : {review.anonymous ? "익명" : review.id}  | 중개사무소 : {review.estate ? review.estate.realEstateAgent.estateName : ""} | 날짜 {review.writeDate ? review.writeDate.split("T")[0] : ""}
                    </div>
                    <div>
                        {loginId === review.id || admin ? <button onClick={() => { delReview() }}>삭제</button> : ""}
                    </div>
                </div>
                <div className={style.boardContentsDiv}>
                    <div className={style.reviewInfo}>별점</div>
                    <div className={style.scoreImg}>
                        {[...Array(maxScore)].map((_, i) => (
                            i >= score ? <img src={notFavorite} alt="..." /> : <img src={favorites} alt="..." />
                        ))}
                        ( {score} / 5.0 )
                    </div>

                    <div className={style.reviewDetails}>
                        <div className={style.reviewInfo}>교통</div>
                        <div>{review.traffic}</div>
                    </div>
                    <div className={style.reviewDetails}>
                        <div className={style.reviewInfo}>주변환경</div>
                        <div>{review.surroundings}</div>
                    </div>
                    <div className={style.reviewDetails}>
                        <div className={style.reviewInfo}>시설</div>
                        <div>{review.facility}</div>
                    </div>
                    <hr />
                    <div className={style.fileImg}>
                        {review.files && review.files.length > 0 ?
                            review.files.map((e, i) => (
                                <div key={i}><img src={`https://storage.googleapis.com/daebbang/review/${e.sysName}`} /></div>
                            )) :
                            <div className={style.emptyFileImg}>첨부파일이 존재하지 않습니다.</div>
                        }
                    </div>

                </div>
                <div className={style.btns}>
                    <Link to="/review/boardReview" state={{ realEstateNumber: review.realEstateNumber }}><button className={style.backBtn}>뒤로가기</button></Link>
                    {loginId === review.id || admin ? <Link to="/review/editReview" state={{ seq: seq }}><button className={style.editBtn}>수정</button></Link> : ""}
                </div>
            </>}
        </>
    );
}

export default ReviewBoardContents