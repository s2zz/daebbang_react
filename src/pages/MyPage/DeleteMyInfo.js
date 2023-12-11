import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dstyle from "./css/DeleteMyInfo.module.css"

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
        <div className={dstyle.delContainer}>
            <div>DAEBBANG 회원 탈퇴</div>
            <div>id : {storedLoginId}</div>
            <div>pw :
                <input type="password" placeholder="input your PW" name="pw" onChange={handleChange} value={pw.pw} />
            </div>
            <button onClick={handleDelete}>회원 탈퇴</button>
        </div>
    );
}

export default DeleteMyInfo;