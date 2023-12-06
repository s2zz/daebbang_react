import style from "./Login.module.css"
import { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Home from "../Home/Home";
import SignUp from "../SignUp/SignUp";


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
            <input type="text" name="id" placeholder="input your ID" onChange={handleChange} value={user.id}></input>
            <div className={style.loginFont}>비밀번호</div>
            <input type="password" name="pw" placeholder="input your PW" onChange={handleChange} value={user.pw}></input>
          </div>
        </div>
        <div className={style.btnBox}>
          <button className={style.loginBtn} onClick={handleLogin}>로그인</button>
        </div>
        <div className={style.findBox}>
          <Link to="/signUp">회원가입</Link>
          <a className={style.findId} href="#">아이디 찾기</a>
          <a className={style.findPw} href="#">비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

function Login() {

  const [loginId, setLoginId] = useState(null);

  const handleLogout = () => {
    axios.get("/api/member/logout").then(resp => {
      setLoginId(null);
      console.log("로그아웃 완료");
    }).catch(resp => {
      console.log(resp);
    })
  }


  return (
    <div>
      {loginId ? <Home /> : <LoginBox setLoginId={setLoginId}></LoginBox>}<br></br>
    </div>

  );
}

export default Login;