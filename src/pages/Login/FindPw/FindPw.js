import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './FindPw.module.css';
import axios from 'axios';

function FindPw() {
  const [findPw, setfindPw] = useState({ id: "", email: "" });
  const [emailRegex, setEmailRegex] = useState(false);

  const handleChange = (e) => {
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const { name, value } = e.target;
    setfindPw(prev => ({ ...prev, [name]: value }));
    if (emailregex.test(e.target.value)) {
      setEmailRegex(true);
    }
    else {
      setEmailRegex(false);
    }
  }
  const handlekeyup = (e) => {
    if (e.code === 'Enter') {
      if (findPw.id!="" && findPw.email!="") {
        if(emailRegex){
          const formData = new FormData();
        formData.append("id", findPw.id);
        formData.append("email", findPw.email);
        axios.post("/api/mail/findPw", formData).then(resp => {
          if(resp.data==0){
            alert("일치하는 정보가 없습니다.");
          }else{
            alert("입력하신 이메일로 임시번호를 발송했습니다.");
          }
          setfindPw({ id: "", email: "" });
          console.log(resp);
        })
        }
        else{
          alert('올바른 이메일 형식을 입력해주세요');
        }
      } else {
        alert('빈칸을 입력해주세요');
      }
    }
  };


  return (
    <div className="container">

      <div className={style.container}>
        <div className={style.findPwBox}>
          <div className={style.logo}>DAEBBANG</div>
          <div className={style.inputFindPwBox}>
            <div className={style.inputFindPw}>
            <div className={style.loginFont}>작성 후 Enter키로 입력해주세요</div>
              <input type="text" name="id" placeholder="아이디를 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findPw.id} className={style.inputInfo}></input><br></br>
              <input type="text" name="email" placeholder="이메일을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findPw.email} className={style.inputInfo}></input><br></br>
              {emailRegex ? <div className={style.good}>올바른 이메일 형식입니다</div> : <div className={style.notgood}>올바른 이메일 형식이 아닙니다.</div>}
            </div>
          </div>
          <div className={style.btnBox}>
          </div>
          <div className={style.findBox}>
            <Link to="/login" className={style.findPw}>로그인</Link>
            <Link to="/signUp" className={style.findPw}>회원가입</Link>
            <a className={style.findPw} href="/login/findId">아이디 찾기</a>
          </div>
        </div>
      </div>


    </div>
  )
}
export default FindPw;