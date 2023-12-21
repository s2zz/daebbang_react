import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import style from './FindPw.module.css';
import axios from 'axios';

function FindEnrollmentPw() {
  const [findPw, setfindPw] = useState({ name: "", phone: "",email:""});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setfindPw(prev => ({ ...prev, [name]: value }));
  }
  const handlekeyup = (e) => {
    if (e.code === 'Enter') {
      if (findPw.name!="" && findPw.phone!="" && findPw.email!="") {
        const formData = new FormData();
      formData.append("name", findPw.name);
      formData.append("phone", findPw.phone);
      formData.append("email", findPw.email);
      axios.post("/api/mail/findenrollmentPw", formData).then(resp => {
        if(resp.data==0){
          alert("일치하는 정보가 없습니다.");
        }else{
          alert("입력하신 이메일로 임시번호를 발송했습니다.");
        }
        setfindPw({ name: "",phone:"", email: "" });
        console.log(resp);
      })
    } else {
      alert('빈칸을 입력해주세요');
    }
    }
  };
  const handlesubmit = () => {
    if (findPw.name!="" && findPw.phone!="" && findPw.email!="") {
      const formData = new FormData();
    formData.append("name", findPw.name);
    formData.append("phone", findPw.phone);
    formData.append("email", findPw.email);
    axios.post("/api/mail/findenrollmentPw", formData).then(resp => {
      if(resp.data==0){
        alert("일치하는 정보가 없습니다.");
      }else{
        alert("입력하신 이메일로 임시번호를 발송했습니다.");
      }
      setfindPw({ name: "",phone:"", email: "" });
      console.log(resp);
    })
  } else {
    alert('빈칸을 입력해주세요');
  }
  }


  return (
    <div className="container">

      <div className={style.container}>
        <div className={style.findPwBox}>
          <div className={style.logo}>DAEBBANG</div>
          <div className={style.inputFindPwBox}>
            <div className={style.inputFindPw}>
            <div className={style.loginFont}>이름</div>
              <input type="text" name="name" placeholder="이름을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findPw.name} className={style.inputInfo}></input>
              <div className={style.blank}></div>
              <div className={style.loginFont}>전화번호</div>
              <input type="text" name="phone" placeholder="번호를 -빼고 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findPw.phone} className={style.inputInfo}></input>
              <div className={style.blank}></div>
              <div className={style.loginFont}>이메일</div>
              <input type="text" name="email" placeholder="이메일을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findPw.email} className={style.inputInfo}></input>
            </div>
          </div>
          <div className={style.btnBox}>
          <button className={style.loginBtn} onClick={handlesubmit}>작성완료</button>
          </div>
          <div className={style.findBox}>
            <Link to="/login"  className={style.findPw}>로그인</Link>
            <Link to="/enrollment" className={style.findPw}>회원가입</Link>
            <a className={style.findPw} href="/login/FindId/FindenrollmentId">아이디 찾기</a>
          </div>
        </div>
      </div>


    </div>
  )
}
export default FindEnrollmentPw;