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
    <div className="container">
      마이페이지다.
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