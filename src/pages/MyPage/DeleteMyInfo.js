import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from "./css/DeleteMyInfo.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const DeleteMyInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
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
            let proceedDel = window.confirm("회원탈퇴하시겠습니까?");
            if (proceedDel) {
                alert("회원탈퇴가 완료되었습니다.");
                axios.delete("/api/member/delete/" + storedLoginId);
                sessionStorage.removeItem('loginId');
                navi("/");
                window.location.reload();
            }
        }).catch(resp => {
            console.log(resp);
            alert("비밀번호를 다시 확인해주세요.");
        });
    }

    return (
        <div className={style.delContainer}>
            <Link to="/mypage"><button className={style.backBtn}><FontAwesomeIcon icon={faArrowLeft} className={style.arrowLeft} /></button></Link>
            <div className={style.titleBox}>
                <div className={style.title}>회원 탈퇴</div>
            </div>
            
            <div className={style.inputBox}>
                <div>
                    ID<br></br>
                    {storedLoginId}<br></br><br></br>
                    PW<br></br>
                    <input type="password" placeholder="input your PW" name="pw" onChange={handleChange} value={pw.pw} />
                </div>
            </div>
            <div className={style.delBtns}>
                <div>
                    <button onClick={handleDelete} className={style.delBtn}>회원 탈퇴</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteMyInfo;