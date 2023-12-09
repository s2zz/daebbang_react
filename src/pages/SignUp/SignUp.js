import style from "./SignUp.module.css";
import DaumPostcode from "react-daum-postcode";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock, faEnvelope, faPhone, faHouse, faFileSignature } from "@fortawesome/free-solid-svg-icons";

function SignUp() {
  const [id, setId] = useState({id:""});
  const [pw, setPw] = useState({pw:""});
  const [pw2, setPw2] = useState({pw2:""});
  const [name, setName] = useState({name:""});
  const [email, setEmail] = useState({email:""});
  const [phone, setPhone] = useState({phone:""});
  const [zipcode, setZipcode] = useState({zipcode:""});
  const [address1, setAddress1] = useState({address1:""});
  const [address2, setAddress2] = useState({address2:""});

  const [fill, setFill] = useState(false);
  const [duplId, setDuplId] = useState(false);
  const [readOnlyState, setReadOnlyState] = useState(false);

  const [samePw, setSamePw] = useState(false);

  const [idRegex, setIdRegex] = useState(false);
  const [pwRegex, setPwRegex] = useState(false);
  const [nameRegex, setNameRegex] = useState(false);
  const [emailRegex, setEmailRegex] = useState(false);
  const [phoneRegex, setPhoneRegex] = useState(false);


  const handleChangeId = (e) => {
    const { name, value } = e.target;
    setId(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');

    const idregex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{5,}$/;

    if (idregex.test(e.target.value)) {
      setIdRegex(true);
    }
  }

  const handleChangePw = (e) => {
    const { name, value } = e.target;
    setPw(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');

    if(e.target.value === pw2.pw2) {
      setSamePw(true);
    } else {
      setSamePw(false);
    }

    const pwregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    
    
    if (pwregex.test(e.target.value)) {
      setPwRegex(true);
    }
  }

  const handleChangePw2 = (e) => {
    const { name, value } = e.target;
    setPw2(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');

    if(pw.pw === e.target.value) {
      setSamePw(true);
    } else {
      setSamePw(false);
    }
  }

  const handleChangeName = (e) => {
    const { name, value } = e.target;
    setName(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');
    const nameregex = /^[가-힣]{2,5}$/;
    
    if (nameregex.test(e.target.value)) {
      setNameRegex(true);
    }
  }

  const handleChangeEmail = (e) => {
    const { name, value } = e.target;
    setEmail(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');
    const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (emailregex.test(e.target.value)) {
      setEmailRegex(true);
    }
  }

  const handleChangePhone = (e) => {
    const { name, value } = e.target;
    setPhone(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');

    const phoneregex = /^\d{11}$/;

    if (phoneregex.test(e.target.value)) {
      setPhoneRegex(true);
    }
  }

  const handleChangeZipcode = (e) => {
    const { name, value } = e.target;
    setZipcode((prev) => ({
      ...prev,
      [name]: value,
      zipcode: document.getElementById('sample6_postcode').value
    }));

    setFill(e.target.value !== '');
  }

  const handleChangeAddress1 = (e) => {
    const { name, value } = e.target;
    setAddress1((prev) => ({
      ...prev,
      [name]: value,
      address1: document.getElementById("sample6_address").value
    }));

    setFill(e.target.value !== '');
  }

  const handleChangeAddress2 = (e) => {
    const { name, value } = e.target;
    setAddress2(prev => ({ ...prev, [name]: value }));

    setFill(e.target.value !== '');
  }

  const duplCheck = (value) => {
    axios.post("/api/member/idDuplCheck", value).then(resp => {
      if (resp.data === false) {
        alert("이미 존재하는 아이디 입니다.");
        setDuplId(false);
        setId({ id: "" });
      } else if (id.id === '') {
        alert("아이디를 먼저 입력해주세요.");
      } else if (!idRegex) {
        alert('아이디는 5글자 이상의 영어 소문자와 숫자로 이루어져야합니다.');
        setId({ id: "" });
      } 
      if(resp.data !== false && id.id !== '' && idRegex) {
        let useId = window.confirm("사용 가능한 아이디 입니다. 사용하시겠습니까?");
        if (useId) {
          setDuplId(true);
          setReadOnlyState(true);
        } else {
          setId({ id: "" });
          setDuplId(false);
        }

      }
    }).catch(() => {
      console.log('아이디 찾기 실패~');
    });
  }

  const navi = useNavigate();
  const increaseNewMemberCount = async () => {
    try {
      const response = await axios.get('/api/admin/todayNewMember');
      if (response.data) {
        console.log('Data exists:', response.data.seq);
        // 해당 데이터의 방문자 수 증가 요청 (PUT 요청)
        await axios.put(`/api/admin/incrementNewMember/${response.data.seq}`);
        console.log('회원 1증가');
      } else {
        console.log('Data does not exist:', response.data);
        // 오늘 날짜의 데이터가 없는 경우 새로운 데이터 삽입 (POST 요청)
        await axios.post('/api/admin/createNewMember');
        console.log('신규 회원 데이터 생성');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleSignUp = async () => {
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
    } else if (!samePw) {
      alert('비밀번호를 다시 확인해주세요.');
    }else {
      try {
        const userData = {
          id: id.id,
          pw: pw.pw,
          name: name.name,
          email: email.email,
          phone: phone.phone,
          zipcode: zipcode.zipcode,
          address1: address1.address1,
          address2: address2.address2
        };
        await increaseNewMemberCount();
        await axios.post("/api/member/signUp", userData);
        alert("회원가입이 완료되었습니다.");
        
        navi("/");
      } catch (error) {
        console.log("회원가입 실패", error);
      }
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
    zipcode.zipcode = data.zonecode;
    address1.address1 = addr + extraAddr;
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
            <FontAwesomeIcon icon={faUser} />
            <input type="text" name="id" id="id" placeholder="input your ID" onChange={handleChangeId} value={id.id} readOnly={readOnlyState} className={[style.inputInfo, style.inputId].join(' ')}></input>
            <button onClick={() => duplCheck({ id: id.id })}>아이디 중복 확인</button><br></br>
            <div className={style.blank}></div>
            <FontAwesomeIcon icon={faLock} />
            <input type="password" name="pw" id="pw" placeholder="input your PW" onChange={handleChangePw} value={pw.pw} className={style.inputInfo}></input><br></br>
            <div className={style.blank}></div>
            <input type="password" name="pw2" id="pw2" placeholder="input your PW Again" onChange={handleChangePw2} value={pw2.pw2} className={[style.inputInfo, style.inputPw2].join(' ')}></input><br></br>
            <div className={style.blank}></div>
            <FontAwesomeIcon icon={faFileSignature} />
            <input type="text" name="name" id="name" placeholder="input your Name" onChange={handleChangeName} value={name.name} className={style.inputInfo}></input><br></br>
            <div className={style.blank}></div>
            <FontAwesomeIcon icon={faEnvelope} />
            <input type="text" name="email" id="email" placeholder="input your E-Mail" onChange={handleChangeEmail} value={email.email} className={style.inputInfo}></input><br></br>
            <div className={style.blank}></div>
            <FontAwesomeIcon icon={faPhone} />
            <input type="text" name="phone" id="phone" placeholder="input your Phone Number" onChange={handleChangePhone} value={phone.phone} className={style.inputInfo}></input><br></br>
            <div className={style.blank}></div>
            <FontAwesomeIcon icon={faHouse} />
            <input type="text" name="zipcode" id="sample6_postcode" placeholder="우편번호" readOnly onChange={handleChangeZipcode} value={zipcode.zipcode} className={[style.inputInfo, style.inputZip].join(' ')}></input>
            <input type="button" value="우편번호 찾기" onClick={handleOpenModal}></input><br></br>
            <div className={style.blank}></div>
            <input type="text" name="address1" id="sample6_address" placeholder="주소" readOnly onChange={handleChangeAddress1} value={address1.address1} className={[style.inputInfo, style.inputAddr].join(' ')}></input><br></br>
            <div className={style.blank}></div>
            <input type="text" name="address2" id="sample6_detailAddress" placeholder="상세주소" onChange={handleChangeAddress2} value={address2.address2} className={[style.inputInfo, style.inputAddr].join(' ')}></input>
            {/* 모달 */}
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