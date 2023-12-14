import * as React from 'react';
import { useState} from 'react';
import style from './FindId.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

function FindId() {


  const [findId, setfindId] = useState({ id: [], email: "" });
  const [emailRegex, setEmailRegex] = useState(false);
  const [size, setSize] = useState(-1);
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
      setSize(response.data.length);
      setfindId({ ...findId, id: response.data, email: "" });

    } catch (error) {
      
    }
  };
  return (
    <div className="container">

      <div className={style.container}>
        <div className={style.findIdBox}>
          <div className={style.logo}>DAEBBANG</div>
          <div className={style.inputFindIdBox}>
            <div className={style.inputFindId}>
              <div className={style.loginFont}>작성 후 Enter키로 입력해주세요</div>
              <input type="text" name="email" placeholder="이메일을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findId.email} className={style.inputInfo}></input><br></br>
              {emailRegex ? <div className={style.good}>올바른 이메일 형식입니다</div> : <div className={style.notgood}>올바른 이메일 형식이 아닙니다.</div>}
            </div>
          </div>
          <div className={style.btnBox}>
            {size == -1 ? <></> : <div>
              <span>확인된 아이디가 {size}개 있습니다</span><br></br>
              {findId.id.map((id, index) => (
                <div key={index}>  {id.slice(0, -3)}***</div>
              ))}
            </div>}
          </div>
          <div className={style.findBox}>
          <Link to="/login" className={style.findId}>로그인</Link>
            <Link to="/signUp" className={style.findId}>회원가입</Link>
            <a className={style.findPw} href="/login/findPw">비밀번호 찾기</a>
          </div>
        </div>
      </div>


    </div>
  )
}
export default FindId;