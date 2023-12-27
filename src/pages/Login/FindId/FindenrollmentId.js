import * as React from 'react';
import { useState } from 'react';
import style from './FindId.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import Swal from 'sweetalert2'

function FindEnrollmentId() {


  const [findId, setfindId] = useState({ id: [], name: "", phone: "" });
  const [size, setSize] = useState(-1);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setfindId(prev => ({ ...prev, [name]: value }));
  }
  const handlekeyup = (e) => {
    if (e.code === 'Enter') {
      if (findId.name === "" || findId.phone === "") {
        alert("모든 항목을 입력해주세요");
      }
      else {
        fetchData();
      }
    }
  }
  const fetchData = async () => {
    try {
      const name = findId.name;
      const phone = findId.phone;
      const response = await axios.get(`/api/estate/findId/${name}/${phone}`);
      if (response.data.length === 0) {
        alert("일치하는 정보가 없습니다");
      }
      setSize(response.data.length);
      setfindId({ ...findId, id: response.data, name: "", phone: "" });
    } catch (error) {
      alert("일치하는 정보가 없습니다");
    }
  };
  const handlesubmit = () => {
    if (findId.name === "" || findId.phone === "") {
      alert("모든 항목을 입력해주세요");
    }
    else {
      fetchData();
    }
  }
  return (
    <div className="container">

      <div className={style.container}>
        <div className={style.findIdBox}>
          <div className={style.logo}>DAEBBANG</div>
          <div className={style.inputFindIdBox}>
            <div className={style.inputFindId}>
              <div className={style.loginFont}>이름</div>
              <input type="text" name="name" placeholder="이름을 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findId.name} className={style.inputInfo}></input><br></br>
              <div className={style.blank}></div>
              <div className={style.loginFont}>전화번호</div>
              <input type="text" name="phone" placeholder="번호를 입력해주세요" onChange={handleChange} onKeyUp={handlekeyup} value={findId.phone} className={style.inputInfo}></input><br></br>
            </div>
          </div>
          <div className={style.btnBox}>

            {size === -1 ? <></> : <div>
              <span>확인된 아이디가 {size}개 있습니다</span><br></br>
              {findId.id.map((id, index) => (
                <div key={index}>  ***{id.slice(3)}</div>
              ))}
            </div>}
          </div>
          <div className={style.btnBox}>
            <button className={style.loginBtn} onClick={handlesubmit}>작성완료</button>
          </div>

          <div className={style.findBox}>
            <Link to="/login" className={style.findId}>로그인</Link>
            <Link to="/enrollment" className={style.findId}>회원가입</Link>
            <a className={style.findPw} href="/login/FindPw/FindenrollmentPw">비밀번호 찾기</a>
          </div>
        </div>
      </div>


    </div>
  )
}
export default FindEnrollmentId;