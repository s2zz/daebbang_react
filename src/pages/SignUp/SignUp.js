import style from "./SignUp.module.css";
import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

function SignUp() {
  const [user, setUser] = useState({id:"",pw:"",name:"",email:"",phone:"",zipcode:"",address1:"",address2:""});

  const handleChange = (e) => {
    const { name, value }= e.target;
    setUser(prev=>({...prev,[name]:value}));
    setUser((prev) => ({
      ...prev,
      zipcode: document.getElementById('sample6_postcode').value,
      address1: document.getElementById("sample6_address").value
    }));
  }

  const navi = useNavigate();

  const handleSignUp = () => {
    console.log(user);
    axios.post("/api/member/signUp",user).then(resp=>{
      alert("회원가입이 완료되었습니다.");
      navi("/");
    }).catch(()=>{
      console.log("회원가입 실패");
    });
  }

  const [showModal, setShowModal] = useState(false);

  const handleComplete = (data) => {
    var addr = ''; // 주소 변수
    var extraAddr = ''; // 참고항목 변수

    //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
      addr = data.roadAddress;
    } else { // 사용자가 지번 주소를 선택했을 경우(J)
      addr = data.jibunAddress;
    }

    // 사용자가 선택한 주소가 도로명 타입일때 참고항목을 조합한다.
    if (data.userSelectedType === 'R') {
      // 법정동명이 있을 경우 추가한다. (법정리는 제외)
      // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
      if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
        extraAddr += data.bname;
      }
      // 건물명이 있고, 공동주택일 경우 추가한다.
      if (data.buildingName !== '' && data.apartment === 'Y') {
        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
      }
      // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
      if (extraAddr !== '') {
        extraAddr = ' (' + extraAddr + ')';
      }
    } else {
      document.getElementById("sample6_extraAddress").value = '';
    }

    // 우편번호와 주소 정보를 해당 필드에 넣는다.
    document.getElementById('sample6_postcode').value = data.zonecode;
    document.getElementById("sample6_address").value = addr + extraAddr;
    // 커서를 상세주소 필드로 이동한다.
    document.getElementById("sample6_detailAddress").focus();

    setShowModal(false);
  }

  const handleOpenModal = () => {
    // 우편번호 찾기 모달 열기
    setShowModal(true);
  };


  return (
    <div className={style.container}>
      <div className={style.loginBox}>
        <div className={style.logo}>DAEBBANG</div>
        <div className={style.inputSignUpBox}>
          <div className={style.inputs}>
            <input type="text" name="id" placeholder="input your ID" onChange={handleChange} value={user.id}></input><br></br>
            <input type="password" name="pw" placeholder="input your PW" onChange={handleChange} value={user.pw}></input><br></br>
            <input type="text" name="name" placeholder="input your Name" onChange={handleChange} value={user.name}></input><br></br>
            <input type="text" name="email" placeholder="input your E-Mail" onChange={handleChange} value={user.email}></input><br></br>
            <input type="text" name="phone" placeholder="input your Phone Number" onChange={handleChange} value={user.phone}></input><br></br>
            <input type="text" name="postcode" id="sample6_postcode" placeholder="우편번호" readOnly onChange={handleChange}></input>
            <input type="button" value="우편번호 찾기" onClick={handleOpenModal}></input><br></br>
            <input type="text" name="address1" id="sample6_address" placeholder="주소" readOnly onChange={handleChange}></input><br></br>
            <input type="text" name="address2" id="sample6_detailAddress" placeholder="상세주소" onChange={handleChange} value={user.address2}></input>
            {/* 모달 */}
            <Modal
              isOpen={showModal}
              onRequestClose={() => setShowModal(false)}
              style={{
                overlay: {
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '400px',
                  height: '400px'
                }
              }}
            >
              <DaumPostcode onComplete={handleComplete} />
            </Modal>
          </div>
        </div>
        <div className={style.btnBox}>
          <button className={style.signUpBtn} onClick={handleSignUp}>회원가입</button>
        </div>
      </div>
    </div>
  );
}


export default SignUp;