import * as React from 'react';
import { useState,useEffect } from 'react';
import style from './FindId.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FindId() {


    const [findId, setfindId] = useState({ id: "", email: "" });
    const [emailRegex, setEmailRegex] = useState(false);
    const size = 0;
    const handleChange = (e) => {
        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


        const { name, value } = e.target;
        setfindId(prev => ({ ...prev, [name]: value }));
        if (emailregex.test(e.target.value)) {
            setEmailRegex(true);
        }
        else {
            setEmailRegex(false);
        }
    }
    const handlekeyup = (e) => {
        if (e.code === 'Enter') {
          if (emailRegex) {
            fetchData();
          } else {
            alert('올바른 이메일 형식을 입력해주세요');
          }
        }
      };

      const fetchData = async () => {
        try {
            const email = findId.email;
          const response = await axios.get(`/api/member/findId/${email}`);
          console.log(response.data); // 데이터 확인용 로그
          console.log(response.data.length);
          console.log(false);
        } catch (error) {
          console.error('데이터를 가져오는 중 에러 발생: ', error);
          console.log(false);
        }
      };
    return (
        <div className="container">

            <div className={style.container}>
                <div className={style.findIdBox}>
                    <div className={style.logo}>DAEBBANG</div>
                    <div className={style.inputFindIdBox}>
                        <div className={style.inputFindId}>
                            <div className={style.loginFont}>이메일</div>
                            <input type="text" name="email" placeholder="여기에 이메일을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findId.email} className={style.inputInfo}></input><br></br>
                            {emailRegex ? <span className={style.good}>올바른 이메일 형식입니다</span> : <span className={style.notgood}>올바른 이메일 형식이 아닙니다.</span>}
                        </div>
                    </div>
                    <div className={style.btnBox}>
                    </div>
                    <div className={style.findBox}>
                        <Link to="/signUp" className={style.findId}>회원가입</Link>
                        <a className={style.findPw} href="/login/findPw">비밀번호 찾기</a>
                    </div>
                </div>
            </div>


        </div>
    )
}
export default FindId;