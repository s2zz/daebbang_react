import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from "./css/ChangePw.module.css"

const ChangePw = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const [pw, setPw] = useState({ pw: "" });
    const [cpw1, setPw1] = useState({ cpw1: "" });
    const [cpw2, setPw2] = useState({ cpw2: "" });

    const [pwRegex, setPwRegex] = useState(false);

    const handleChangePw = (e) => {
        const { name, value } = e.target;
        setPw(prev => ({ ...prev, [name]: value }));
    }

    const handleChangeCpw1 = (e) => {
        const { name, value } = e.target;
        setPw1(prev => ({ ...prev, [name]: value }));

        const pwregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

        if (pwregex.test(e.target.value)) {
            setPwRegex(true);
        }
    }

    const handleChangeCpw2 = (e) => {
        const { name, value } = e.target;
        setPw2(prev => ({ ...prev, [name]: value }));
    }

    const navi = useNavigate();

    const handleChange = () => {
        const formData = new FormData();
        formData.append("id", storedLoginId);
        formData.append("pw", pw.pw);
        axios.post("/api/member/login", formData).then(resp => {
            if (pwRegex) {
                if (cpw1.cpw1 == cpw2.cpw2) {
                    const formData2 = new FormData();
                    formData2.append("id", storedLoginId);
                    formData2.append("pw", cpw1.cpw1);
                    axios.post("/api/member/changePw", formData2).then(resp => {
                        alert("비밀번호 변경이 완료되었습니다.");
                        navi("/mypage");
                        window.location.reload();
                    });
                } else {
                    alert("바꿀 비밀번호를 다시 한 번 확인해주세요.");
                }
            } else {
                alert('비밀번호는 8글자 이상의 영문, 숫자, 특수문자로 이루어져야합니다.');
            }

        }).catch(resp => {
            console.log(resp);
            alert("비밀번호를 다시 확인해주세요.");
        });
    }

    return (
        <div className={style.chaContainer}>
            <Link to="/mypage"><button>뒤로가기</button></Link>
            <div>현재 비번 : <input type="password" name="pw" onChange={handleChangePw} value={pw.pw}></input></div>
            <div>바꿀 비번 : <input type="password" name="cpw1" onChange={handleChangeCpw1} value={cpw1.cpw1}></input></div>
            <div>바꿀 비번 확인 : <input type="password" name="cpw2" onChange={handleChangeCpw2} value={cpw2.cpw2}></input></div>
            <button onClick={handleChange}>비번 바꾸기</button>
        </div>
    );
}

export default ChangePw;