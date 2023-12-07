import style from "./SignUp.module.css";
import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';

function SignUp() {
  const [user, setUser] = useState({ id: "", pw: "", name: "", email: "", phone: "", zipcode: "", address1: "", address2: "" });

  const [fill, setFill] = useState(false);
  const [duplId, setDuplId] = useState(false);
  const [readOnlyState, setReadOnlyState] = useState(false);

  const [idRegex, setIdRegex] = useState(false);
  const [pwRegex, setPwRegex] = useState(false);
  const [nameRegex, setNameRegex] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);
  const [phoneRegex, setPhoneRegex] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    setUser((prev) => ({
      ...prev,
      zipcode: document.getElementById('sample6_postcode').value,
      address1: document.getElementById("sample6_address").value
    }));

    setFill(
      user.id !== '' &&
      user.pw !== '' &&
      user.name !== '' &&
      user.email !== '' &&
      user.phone !== '' &&
      user.zipcode !== '' &&
      user.address1 !== '' &&
      user.address2 !== ''
    );

    const idregex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{5,}$/;
    const pwregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    const nameregex = /^[가-힣]{2,5}$/;
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneregex = /^\d{11}$/;

    if (idregex.test(user.id)) {
      setIdRegex(true);
    }
    if (pwregex.test(user.pw)) {
      setPwRegex(true);
    }
    if (nameregex.test(user.name)) {
      setNameRegex(true);
    }
    if (emailregex.test(user.email)) {
      setEmailRegex(true);
    }
    if (phoneregex.test(user.phone)) {
      setPhoneRegex(true);
    }
  }

  const duplCheck = (value) => {
    axios.post("/api/member/idDuplCheck", value).then(resp => {
      console.log(resp.data);
      if(resp.data===false) {
        alert("이미 존재하는 아이디 입니다.");
        setDuplId(false);
        setUser({ id: ""});
      } else if (user.id==='') {
        alert("아이디를 먼저 입력해주세요.");
      } else {
        let useId = window.confirm("사용 가능한 아이디 입니다. 사용하시겠습니까?");
        if(useId) {
          setDuplId(true);
          setReadOnlyState(true);
        } else {
          setUser({ id: ""});
          setDuplId(false);
        }
        
      }
    }).catch(() => {
      console.log('아이디 찾기 실패~');
    });
  }

  const navi = useNavigate();

  const handleSignUp = () => {
    if (!fill) {
      alert('모든 항목을 입력해주세요.');
    } else if (!duplId) {
      alert('아이디 중복 확인이 필요합니다.');
    } else if (!idRegex) {
      alert('아이디는 5글자 이상의 영어 소문자와 숫자로 이루어져야합니다.');
    } else if (!pwRegex) {
      alert('비밀번호는 8글자 이상의 영문, 숫자, 특수문자로 이루어져야합니다.');
    } else if (!nameRegex) {
      alert('이름은 2~5글자의 한글이어야합니다.');
    } else if (!emailRegex) {
      alert('이메일 형식을 올바르게 입력해주세요.');
    } else if (!phoneRegex) {
      alert('휴대폰 번호는 숫자 11자리만 입력해주세요.');
    } else {
      console.log(user);
      axios.post("/api/member/signUp", user).then(resp => {
        alert("회원가입이 완료되었습니다.");
        navi("/");
      }).catch(() => {
        console.log("회원가입 실패");
      });
    }
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
            <input type="text" name="id" id="id" placeholder="input your ID" onChange={handleChange} value={user.id} readOnly={readOnlyState}></input>
            <button onClick={() => duplCheck({ id: user.id })}>아이디 중복 확인</button><br></br>
            <input type="password" name="pw" id="pw" placeholder="input your PW" onChange={handleChange} value={user.pw}></input><br></br>
            <input type="text" name="name" id="name" placeholder="input your Name" onChange={handleChange} value={user.name}></input><br></br>
            <input type="text" name="email" id="email" placeholder="input your E-Mail" onChange={handleChange} value={user.email}></input><br></br>
            <input type="text" name="phone" id="phone" placeholder="input your Phone Number" onChange={handleChange} value={user.phone}></input><br></br>
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