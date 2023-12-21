import style from '../Write/WriteReview.module.css';
import fav from '../assets/favorites.png';
import notFav from '../assets/notFavorite.png';
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const EditReview = () => {

    const location = useLocation();
    const navi = useNavigate();
    const seq = location.state !== null && location.state.seq !== null ? location.state.seq : 0;
    const [allPrevImg, setAllPrevImg] = useState([]);
    const [score, setScore] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false });
    const [url, setUrl] = useState({ files0: "", files1: "", files2: "", files3: "", files4: "" });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        axios.get(`/api/review/selectReviewBySeq/${seq}`).then(resp => {
            setFormData(resp.data);

            let array = {};
            for (let i = 0; i < resp.data.score; i++) {
                array = { ...array, [i]: true };
            }
            setScore(prev => ({ ...prev, ...array }));

            let urlArr = {};
            let prevImgs = [];
            resp.data.files.map((e, i) => {
                let key = "files" + i
                prevImgs.push(e.sysName);
                urlArr = { ...urlArr, [key]: "/uploads/review/" + e.sysName }
            });
            setAllPrevImg([...prevImgs]);
            setUrl({ ...urlArr });
        })
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = async (e) => {
        const files = e.target.files[0];

        const formImg = new FormData();
        formImg.append("files", files);
        formImg.append("path", "review");

        try {
            const imgUrl = await axios.post("/api/file/upload", formImg);
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
        submitFormData.append("traffic", formData.traffic);
        submitFormData.append("surroundings", formData.surroundings);
        submitFormData.append("facility", formData.facility);
        submitFormData.append("score", totalScore);

        let filesList = Object.values(formData.files);
        console.log("d")
        console.log(filesList);
        filesList.forEach((e) => {
            if (e !== "" && e instanceof File) {
                submitFormData.append("files", e);
            }
        })

        let existFile = Object.values(url).filter(e => e.includes("/uploads/review/"));
        let existFileSysName = [];
        existFile.forEach((e) => { existFileSysName.push(e.split("/uploads/review/")[1]); });

        let delFileList = [];
        let exist = false;
        for (let i = 0; i < allPrevImg.length; i++) {
            for (let j = 0; j < existFileSysName.length; j++) {
                if (allPrevImg[i] === existFileSysName[j]) {
                    exist = true;
                    break;
                }
            }
            exist ? exist = false : delFileList.push(allPrevImg[i]);
        }

        submitFormData.append("delFileList", delFileList);
        axios.put(`/api/review/${seq}`, submitFormData).then(resp => {
            alert("리뷰 수정에 성공하였습니다");
            navi("/home/oneroom/list");
        }).catch(err => {
            alert("리뷰 등록에 실패하였습니다");
            console.log(err);
        })

    }


    return (
        <div className={style.borderBox}>
            <div className={style.boardTitle}>리뷰 작성 | <span>매물 번호 : {formData.estateId}</span></div>
            <hr></hr>
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
                    <textarea placeholder="교통 리뷰 입력" onChange={handleChange} name="traffic" value={formData.traffic}></textarea>
                </div>
            </div>
            <div className={style.reviewInsert}>
                <div>주변 환경<span>*</span></div>
                <div>
                    <textarea placeholder="주변 환경 리뷰 입력" onChange={handleChange} name="surroundings" value={formData.surroundings}></textarea>
                </div>
            </div>
            <div className={style.reviewInsert}>
                <div>시설<span>*</span></div>
                <div>
                    <textarea placeholder="시설 리뷰 입력" onChange={handleChange} name="facility" value={formData.facility}></textarea>
                </div>
            </div>
            <hr />
            <div>
                <div className={style.imgInfo}>
                    <div>사진 첨부 |&nbsp;</div>
                    <div>10MB 이하 파일만 등록 가능</div>
                </div>
                <div className={style.imgBox}>
                    <input type="file" name="files0" style={{ display: 'none' }} id="fileInput0" onChange={handleFileChange} accept="image/*" />
                    <input type="file" name="files1" style={{ display: 'none' }} id="fileInput1" onChange={handleFileChange} accept="image/*" />
                    <input type="file" name="files2" style={{ display: 'none' }} id="fileInput2" onChange={handleFileChange} accept="image/*" />
                    <input type="file" name="files3" style={{ display: 'none' }} id="fileInput3" onChange={handleFileChange} accept="image/*" />
                    <input type="file" name="files4" style={{ display: 'none' }} id="fileInput4" onChange={handleFileChange} accept="image/*" />
                    <div>
                        {url.files0 ?
                            <>
                                <img src={url.files0} alt="..." />
                                <label onClick={() => imgDel("files0")}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                            </> :
                            <label htmlFor="fileInput0"><FontAwesomeIcon icon={faPlus} size="2xs" /></label>
                        }

                    </div>
                    <div>
                        {url.files1 ?
                            <>
                                <img src={url.files1} alt="..." />
                                <label onClick={() => imgDel("files1")}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                            </> :
                            <label htmlFor="fileInput1"><FontAwesomeIcon icon={faPlus} size="2xs" /></label>

                        }
                    </div>
                    <div>
                        {url.files2 ?
                            <>
                                <img src={url.files2} alt="..." />
                                <label onClick={() => imgDel("files2")}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                            </> :
                            <label htmlFor="fileInput2"><FontAwesomeIcon icon={faPlus} size="2xs" /></label>

                        }
                    </div>
                    <div>
                        {url.files3 ?
                            <>
                                <img src={url.files3} alt="..." />
                                <label onClick={() => imgDel("files3")}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                            </> :
                            <label htmlFor="fileInput3"><FontAwesomeIcon icon={faPlus} size="2xs" /></label>

                        }
                    </div>
                    <div>
                        {url.files4 ?
                            <>
                                <img src={url.files4} alt="..." />
                                <label onClick={() => imgDel("files4")}><FontAwesomeIcon icon={faXmark} size="2xs" /></label>
                            </> :
                            <label htmlFor="fileInput4"><FontAwesomeIcon icon={faPlus} size="2xs" /></label>

                        }
                    </div>
                </div>
            </div>
            <hr />
            <div className={style.btns}>
                <button onClick={()=>{navi(-1)}}>작성 취소</button>
                <button onClick={handleAdd}>리뷰 수정</button>
            </div>
        </div>
    );
}

export default EditReview;