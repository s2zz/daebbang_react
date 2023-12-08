import style from "./Login.module.css"
import { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopForm from "../commons/TopForm";


const LoginBox = ({ setLoginId }) => {
  const [user, setUser] = useState({ id: "", pw: "" });

  const navi = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }

  const handleLogin = () => {
    const formData = new FormData();
    formData.append("id", user.id);
    formData.append("pw", user.pw);
    axios.post("/api/member/login", formData).then(resp => {
      setLoginId(user.id); // 로그인 성공시
      sessionStorage.setItem('loginId', user.id);
      setUser({ id: "", pw: "" });
      navi("/");
      window.location.reload();
    }).catch(resp => {
      console.log(resp); // 로그인 실패시
      setUser({ id: "", pw: "" });
    });
  }

  return (
    <div className={style.container}>
      <div className={style.loginBox}>
        <div className={style.logo}>DAEBBANG</div>
        <div className={style.inputLoginBox}>
          <div className={style.inputLogin}>
            <div className={style.loginFont}>아이디</div>
            <input type="text" name="id" placeholder="input your ID" onChange={handleChange} value={user.id} className={style.inputInfo}></input>
            <div className={style.blank}></div>
            <div className={style.loginFont}>비밀번호</div>
            <input type="password" name="pw" placeholder="input your PW" onChange={handleChange} value={user.pw} className={style.inputInfo}></input>
          </div>
        </div>
        <div className={style.btnBox}>
          <button className={style.loginBtn} onClick={handleLogin}>로그인</button>
        </div>
        <div className={style.findBox}>
          <Link to="/signUp" className={style.findId}>회원가입</Link>
          <a className={style.findId} href="/login/findId">아이디 찾기</a>
          <a className={style.findPw} href="/login/findPw">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

function Login() {

  const [loginId, setLoginId] = useState(null);

 


  return (
    <div>
      {loginId ? <TopForm setLoginId={setLoginId}/> : <LoginBox setLoginId={setLoginId}></LoginBox>}<br></br>
    </div>

  );
}

export default Login;