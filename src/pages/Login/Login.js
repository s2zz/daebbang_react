import style from "./Login.module.css"
import { useState, useEffect } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import TopForm from "../commons/TopForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHammer, faLock } from "@fortawesome/free-solid-svg-icons";


const LoginBox = ({ setLoginId }) => {
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const handleKeyDown = (event) => {
      // event.ctrlKey, event.shiftKey 등을 사용하여 각 키의 상태를 확인
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        setShowModal(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const [user, setUser] = useState({ id: "", pw: "" });
  const [estate, setEstate] = useState({ id: "", pw: "" });
  const [admin, setAdmin] = useState({ id: "", pw: "" });

  const navi = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }

  const handleEstateChange = (e) => {
    const { name, value } = e.target;
    setEstate(prev => ({ ...prev, [name]: value }));
  }

  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
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

  const handleEstateLogin = () => {
    const formData = new FormData();
    formData.append("id", estate.id);
    formData.append("pw", estate.pw);
    axios.post("/api/estate/login", formData).then(resp => {
      setLoginId(estate.id); // 로그인 성공시
      sessionStorage.setItem('loginId', estate.id);
      setEstate({ id: "", pw: "" });
      navi("/");
      window.location.reload();
    }).catch(resp => {
      console.log(resp); // 로그인 실패시
      setEstate({ id: "", pw: "" });
    });
  }

  const handleAdminLogin = () => {
    const formData = new FormData();
    formData.append("id", admin.id);
    formData.append("pw", admin.pw);
    axios.post("/api/member/login", formData).then(resp => {
      setLoginId(admin.id); // 로그인 성공시
      sessionStorage.setItem('loginId', admin.id);
      sessionStorage.setItem('isAdmin', true);
      setAdmin({ id: "", pw: "" });
      navi("/");
      window.location.reload();
    }).catch(resp => {
      console.log(resp); // 로그인 실패시
      setAdmin({ id: "", pw: "" });
    });
  }

  return (
    <div className={style.container}>
      <div className={style.loginBox}>
        <div className={style.logo}>일반 로그인</div>
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
      <div className={style.estateLoginBox}>
        <div className={style.logo}>공인중개사 로그인</div>
        <div className={style.inputLoginBox}>
          <div className={style.inputLogin}>
            <div className={style.loginFont}>아이디</div>
            <input type="text" name="id" placeholder="input your ID" onChange={handleEstateChange} value={estate.id} className={style.inputInfo}></input>
            <div className={style.blank}></div>
            <div className={style.loginFont}>비밀번호</div>
            <input type="password" name="pw" placeholder="input your PW" onChange={handleEstateChange} value={estate.pw} className={style.inputInfo}></input>
          </div>
        </div>
        <div className={style.btnBox}>
          <button className={style.loginBtn} onClick={handleEstateLogin}>로그인</button>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        appElement={document.getElementById('root')}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '430px',
            height: '400px',
            padding: '0px',
            overflow: 'none'
          }
        }}
      >

        <div className={style.adminModal}>
          <div>
            <div className={style.adminTitle}>관리자 로그인</div>
            <div>
              <FontAwesomeIcon icon={faHammer} className={style.icon} />
              <input type="text" placeholder="input admin ID" onChange={handleAdminChange} name="id" value={admin.id}></input><br></br><br></br>
              <FontAwesomeIcon icon={faLock} className={style.icon} />
              <input type="password" placeholder="input admin PW" onChange={handleAdminChange} name="pw" value={admin.pw}></input><br></br>
            </div>
            <div className={style.adminBtnDiv}>
              <button className={style.adminBtn} onClick={handleAdminLogin}>로그인</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>


  );
}

function Login() {

  const [loginId, setLoginId] = useState(null);

  return (
    <div>
      {loginId ? <TopForm setLoginId={setLoginId} /> : <LoginBox setLoginId={setLoginId}></LoginBox>}<br></br>
    </div>

  );
}

export default Login;