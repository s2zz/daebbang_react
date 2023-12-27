import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from "./css/DeleteMyInfo.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

const DeleteMyInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const isEstate = sessionStorage.getItem('isEstate');
    const [pw, setPw] = useState({ pw: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPw(prev => ({ ...prev, [name]: value }));
    }

    const navi = useNavigate();

    const handleDelete = () => {
        const formData = new FormData();
        formData.append("id", storedLoginId);
        formData.append("pw", pw.pw);
        axios.post("/api/member/login", formData).then(resp => {
            Swal.fire({
                title: "회원 탈퇴 하시겠습니까?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "탈퇴"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("탈퇴가 완료되었습니다", "", "success");
                    axios.delete("/api/member/delete/" + storedLoginId);
                    sessionStorage.removeItem('loginId');
                    navi("/");
                    window.location.reload();
                }
            });
        }).catch(resp => {
            Swal.fire({
                text: "비밀번호를 다시 확인해주세요"
            });
        });
    }

    const handleEstateDelete = () => {
        const formData = new FormData();
        formData.append("id", storedLoginId);
        formData.append("pw", pw.pw);
        axios.post("/api/estate/login", formData).then(resp => {
            Swal.fire({
                title: "회원 탈퇴 하시겠습니까?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "탈퇴"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("탈퇴가 완료되었습니다", "", "success");
                    axios.delete("/api/estate/delete/" + storedLoginId);
                    sessionStorage.removeItem('loginId');
                    sessionStorage.removeItem('isEstate');
                    navi("/");
                    window.location.reload();
                }
            });
        }).catch(resp => {
            Swal.fire({
                text: "비밀번호를 다시 확인해주세요"
            });
        });
    }

    return (
        <div className={style.delContainer}>
            <Link to="/mypage"><button className={style.backBtn}><FontAwesomeIcon icon={faArrowLeft} className={style.arrowLeft} /></button></Link>
            <div className={style.titleBox}>
                <div className={style.title}>회원 탈퇴</div>
            </div>
            {!isEstate ?
                <div>
                    <div className={style.inputBox}>
                        <div>
                            ID<br></br>
                            {storedLoginId}<br></br><br></br>
                            PW<br></br>
                            <input type="password" placeholder="비밀번호 입력" name="pw" onChange={handleChange} value={pw.pw} className={style.inputInfo}/>
                        </div>
                    </div>
                    <div className={style.delBtns}>
                        <div>
                            <button onClick={handleDelete} className={style.delBtn}>회원 탈퇴</button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className={style.inputBox}>
                        <div>
                            ID<br></br>
                            {storedLoginId}<br></br><br></br>
                            PW<br></br>
                            <input type="password" placeholder="비밀번호 입력" name="pw" onChange={handleChange} value={pw.pw} className={style.inputInfo}/>
                        </div>
                    </div>
                    <div className={style.delBtns}>
                        <div>
                            <button onClick={handleEstateDelete} className={style.delBtn}>회원 탈퇴</button>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default DeleteMyInfo;