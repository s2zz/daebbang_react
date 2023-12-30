import style from './WriteReview.module.css';
import fav from '../assets/favorites.png';
import notFav from '../assets/notFavorite.png';
import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

const WriteReview = ({loginId}) => {
    const location = useLocation();
    const navi = useNavigate();
    const estateId = location.state !== null && location.state.estateCode !== null ? location.state.estateCode : 0;
    const approvalCode = location.state !== null && location.state.approvalCode !== null ? location.state.approvalCode : "";

    const [formData, setFormData] = useState({ estateId: estateId, approvalCode: approvalCode, traffic: "", surroundings: "", facility: "", anonymouse:"true", files: {} });
    const storedLoginId = sessionStorage.getItem('loginId');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const [url, setUrl] = useState({ files0: "", files1: "", files2: "", files3: "", files4: "" });
    const handleFileChange = async (e) => {
        const files = e.target.files[0];

        const formImg = new FormData();
        formImg.append("files", files);
        formImg.append("path", "review");
        console.log("d");
        try {
            const imgUrl = await axios.post("/api/file/upload", formImg);
            console.log(imgUrl)
            setUrl(prev => ({ ...prev, [e.target.name]: imgUrl.data[0] }));
            setFormData(prev => ({ ...prev, files: { ...prev.files, [e.target.name]: files } }));
        } catch (err) {
            alert("이미지 첨부에 실패하였습니다");
            console.log(err);
        }
    }

    const imgDel = (files) => {
        setUrl(prev => ({ ...prev, [files]: "" }));
        setFormData(prev => ({ ...prev, files: { ...prev.files, [files]: "" } }))
    }

    const [score, setScore] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false });
    const addScore = (seq) => {
        let array = {};
        for (let i = 0; i <= seq; i++) {
            array = { ...array, [i]: true };
        }
        setScore(prev => ({ ...prev, ...array }));
    }

    const delScore = (seq) => {
        let array = {};
        for (let i = 5; i > seq; i--) {
            array = { ...array, [i]: false };
        }
        setScore(prev => ({ ...prev, ...array }))
    }

    const handleAdd = () => {

        let totalScore = Object.values(score).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        console.log(totalScore)
        if (totalScore === 0) {
            alert("별점을 입력해주세요");
            return;
        }

        if (formData.traffic === "") {
            alert("교통 리뷰를 입력해주세요");
            return;
        }

        if (formData.surroundings === "") {
            alert("주변 환경 리뷰를 입력해주세요");
            return;
        }

        if (formData.facility === "") {
            alert("시설 리뷰를 입력해주세요");
            return;
        }

        console.log(formData.files);
        const submitFormData = new FormData();
        submitFormData.append("estateId", formData.estateId);
        submitFormData.append("anonymous",formData.anonymouse);
        submitFormData.append("approvalCode", formData.approvalCode);
        submitFormData.append("traffic", formData.traffic);
        submitFormData.append("surroundings", formData.surroundings);
        submitFormData.append("facility", formData.facility);
        submitFormData.append("score", totalScore);

        let filesList = Object.values(formData.files);

        filesList.forEach((e) => {
            if (e !== "") {
                console.log(e);
                submitFormData.append("files", e);
            }
        })

        const writeComplete = new FormData();
        writeComplete.append("userId", storedLoginId);
        writeComplete.append("estateId", formData.estateId);
        writeComplete.append("approvalCode", 'a5');

        axios.put("/api/reviewApproval/writeComplete", writeComplete);

        axios.post("/api/review", submitFormData).then(resp => {
            alert("리뷰 등록에 성공하였습니다");
            navi("/");
        }).catch(err => {
            alert("리뷰 등록에 실패하였습니다");
            console.log(err);
        })

    }

    /*리뷰 쓰기 권한 없을 시*/
    const refuseWrite = () => {
        alert("리뷰 작성 권한이 없습니다");
        navi("/");
        return;
    }

    return (
        <div>
            {estateId === 0 || approvalCode === "" || loginId===null ? refuseWrite()
                :
                <div className={style.borderBox}>
                    <div className={style.boardTitle}>리뷰 작성 | <span>매물 번호 : {estateId}</span></div>
                    <hr></hr>
                    <div className={style.anonymousInfo}>
                        <div>아이디 표시<span>*</span> &nbsp;| </div>
                        <div><input type="radio" name="anonymous" value="true" onChange={handleChange}/><span>익명</span><input type="radio"name="anonymous" value="false" onChange={handleChange}/><span>실명</span></div>
                    </div>
                    <div className={style.scoreInfo}>
                        <div>별점<span>*</span> &nbsp;| </div>
                        <div className={style.scoreBox}>
                            {
                                [0, 1, 2, 3, 4].map((e, i) => (
                                    <div key={i}>
                                        {score[e] ? <img src={fav} alt="..." onClick={() => delScore(e)} /> : <img src={notFav} alt="..." onClick={() => addScore(e)} />}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className={style.reviewInsert}>
                        <div>교통<span>*</span></div>
                        <div>
                            <textarea placeholder="교통 리뷰 입력" onChange={handleChange} name="traffic"></textarea>
                        </div>
                    </div>
                    <div className={style.reviewInsert}>
                        <div>주변 환경<span>*</span></div>
                        <div>
                            <textarea placeholder="주변 환경 리뷰 입력" onChange={handleChange} name="surroundings"></textarea>
                        </div>
                    </div>
                    <div className={style.reviewInsert}>
                        <div>시설<span>*</span></div>
                        <div>
                            <textarea placeholder="시설 리뷰 입력" onChange={handleChange} name="facility"></textarea>
                        </div>
                    </div>
                    <hr />
                    <div>
                        <div className={style.imgInfo}>
                            <div>사진 첨부 |&nbsp;</div>
                            <div>10MB 이하 파일만 등록 가능</div>
                        </div>
                        <div className={style.imgBox}>
                            {
                                [0, 1, 2, 3, 4].map((e, i) => (
                                    <div key={i}>
                                        <input type="file" name="files0" style={{ display: 'none' }} id="fileInput0" onChange={handleFileChange} accept="image/*" />
                                        {url[`files${i}`] ?
                                            <>
                                                <img src={url[`files${i}`]} alt="..." />
                                                <label onClick={() => imgDel(`files${i}`)}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                                            </> :
                                            <label htmlFor={`fileInput${i}`}><FontAwesomeIcon icon={faPlus} size="2xs" /></label>
                                        }
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <hr />
                    <div className={style.btns}>
                        <Link to="/myPage"><button>작성 취소</button></Link>
                        <button onClick={handleAdd}>리뷰 등록</button>
                    </div>
                </div>
            }
        </div>
    );
}


export default WriteReview;