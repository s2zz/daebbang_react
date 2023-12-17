import style from './WriteReview.module.css';
import fav from '../assets/favorites.png';
import notFav from '../assets/notFavorite.png';
import { useState } from "react";

const WriteReview = () => {
    const [formData, setFormData] = useState({ realEstateNumber: "", estateId: 0, approvalCode: "", traffic: "", surroundings: "", facility: "", score: 0, files: {} });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("name:" + name + " / value:" + value);
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, files: { ...prev.files, [e.target.name]: e.target.files[0] } }));
    }

    const [score, setScore] = useState({ 0: false, 1: false, 2: false, 3: false, 4: false });
    const addScore = (seq) => {
        let array = {};
        for(let i=0;i<=seq;i++){
            array = {...array, [i]:true};
        } 
        setScore(prev => ({ ...prev, ...array}));
    }

    const delScore = (seq) => {
        let array = {};
        for(let i=5;i>seq;i--){
            array = {...array, [i]:false};
        }
        setScore(prev=>({...prev,...array}))
    }

    const handleAdd = () => {
        console.log(formData);
    }

    return (
        <>
            <div>매물이름</div>
            <div className={style.scoreBox}>
                <div>
                    {
                        score[0] ? <img src={fav} alt="..." onClick={() => delScore(0)}/> : <img src={notFav} alt="..." onClick={() => addScore(0)} />
                    }
                </div>
                <div>
                    {
                        score[1] ? <img src={fav} alt="..." onClick={() => delScore(1)}/> : <img src={notFav} alt="..." onClick={() => addScore(1)} />
                    }
                </div>
                <div>
                    {
                        score[2] ? <img src={fav} alt="..." onClick={() => delScore(2)}/> : <img src={notFav} alt="..." onClick={() => addScore(2)} />
                    }
                </div>
                <div>
                    {
                        score[3] ? <img src={fav} alt="..." onClick={() => delScore(3)}/> : <img src={notFav} alt="..." onClick={() => addScore(3)} />
                    }
                </div>
                <div>
                    {
                        score[4] ? <img src={fav} alt="..." onClick={() => delScore(4)}/> : <img src={notFav} alt="..." onClick={() => addScore(4)} />
                    }
                </div>
            </div>
            <hr />
            <div>
                <div>교통</div>
                <div>
                    <textarea placeholder="교통 리뷰 입력" onChange={handleChange} name="traffic"></textarea>
                </div>
            </div>
            <div>
                <div>주변 환경</div>
                <div>
                    <textarea placeholder="주변 환경 리뷰 입력" onChange={handleChange} name="surroundings"></textarea>
                </div>
            </div>
            <div>
                <div>시설</div>
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
                    <input type="file" name="files1" style={{ display: 'none' }} id="fileInput1" onChange={handleFileChange} />
                    <input type="file" name="files2" style={{ display: 'none' }} id="fileInput2" onChange={handleFileChange} />
                    <input type="file" name="files3" style={{ display: 'none' }} id="fileInput3" onChange={handleFileChange} />
                    <input type="file" name="files4" style={{ display: 'none' }} id="fileInput4" onChange={handleFileChange} />
                    <input type="file" name="files5" style={{ display: 'none' }} id="fileInput5" onChange={handleFileChange} />
                    <div><label htmlFor="fileInput1">+</label></div>
                    <div><label htmlFor="fileInput2">+</label></div>
                    <div><label htmlFor="fileInput3">+</label></div>
                    <div><label htmlFor="fileInput4">+</label></div>
                    <div><label htmlFor="fileInput5">+</label></div>
                </div>
            </div>
            <hr />
            <div>
                <button>작성 취소</button>
                <button onClick={handleAdd}>리뷰 등록</button>
            </div>
        </>
    );
}


export default WriteReview;