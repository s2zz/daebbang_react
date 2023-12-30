import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from "./css/ProfileImage.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Loading from '../commons/Loading';

const ProfileImage = () => {
    // 이미지 파일
    const [profileImage, setProfileImage] = useState([]);
    // 이미지 미리보기
    const [imagePreviews, setImagePreviews] = useState([]);
    // 임시 이미지
    const [tempImages, setTempImages] = useState([]);

    const storedLoginId = sessionStorage.getItem('loginId');
    const [loading, setLoading] = useState(true);

    const navi = useNavigate();

    const handleImageChange = (e) => {
        const files = e.target.files;

        if (files.length > 0) {
            setProfileImage([...files]);

            const previews = [];
            for (const file of files) {
                // 파일리더 API
                const reader = new FileReader();
                reader.onload = (e) => {
                    previews.push(e.target.result);

                    if (previews.length === files.length) {
                        setImagePreviews(previews);
                    }
                }
                reader.readAsDataURL(file);
            }
        } else {
            setProfileImage([]);
            setImagePreviews([]);
        }
    }

    const handleSubmit = () => {
        const formData = new FormData();

        for (const image of profileImage) {
            formData.append("profileImage", image);
        }

        axios.post(`/api/estate/profileImage/${storedLoginId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(resp => {
                console.log(resp);
                navi("/MyPage");
            })
            .catch(error => {
                console.error("Error:", error);
            });
    }

    useEffect(() => {
        axios.get(`/api/estate/profileImage/${storedLoginId}`)
            .then(resp => {


                // 이미지 태그를 상태에 설정
                setTempImages(resp.data);

                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, [storedLoginId]);

    return (
        <>
            {loading ? <Loading></Loading> :
                (<div className={style.chaContainer}>
                    <div className={style.backBtns}>
                        <Link to="/mypage"><button className={style.backBtn}><FontAwesomeIcon icon={faArrowLeft} className={style.arrowLeft} /></button></Link>
                    </div>
                    <div className={style.titleBox}>
                        <div className={style.title}>대표 이미지</div>
                    </div>
                    <div className={style.imagePreviews}>
                        {imagePreviews.length > 0 ? (
                            imagePreviews.map((preview, index) => (
                                <img key={index} src={preview} alt={`Preview ${index}`} className={style.imagePreview} />
                            ))
                        ) : (
                            tempImages ? (
                                tempImages.map((preview, index) => (

                                    <img key={index}
                                        src={`https://storage.googleapis.com/daebbang/agentProfiles/${preview.sysName}`}
                                        alt={`Preview ${index}`}
                                        className={style.imagePreview} />
                                ))
                            ) : (
                                <p>No images available</p>
                            ))
                        }
                    </div>
                    <div className={style.inputDiv}>
                        <input type="file" accept="image/gif, image/jpeg, image/png" onChange={handleImageChange} />
                    </div>
                    <div className={style.inputDiv}>
                        <button className={style.changeBtn} onClick={handleSubmit}>대표 이미지 변경</button>
                    </div>
                </div>)
            }
        </>
    );
}

export default ProfileImage;