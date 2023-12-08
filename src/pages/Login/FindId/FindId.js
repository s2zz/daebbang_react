import React from 'react';
import { Routes, Route } from 'react-router-dom';
import style from './FindId.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FindId() {
    return (
        <div className="container">
           
    <div className={style.container}>
      <div className={style.findIdBox}>
        <div className={style.logo}>DAEBBANG</div>
        <div className={style.inputFindIdBox}>
          <div className={style.inputFindId}>
            
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