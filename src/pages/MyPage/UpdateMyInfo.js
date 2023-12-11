import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import DaumPostcode from "react-daum-postcode";
import style from "./css/UpdateMyInfo.module.css"

const UpdateMyInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');

    const [name, setName] = useState({ name: "" });
    const [email, setEmail] = useState({ email: "" });
    const [phone, setPhone] = useState({ phone: "" });
    const [zipcode, setZipcode] = useState({ zipcode: "" });
    const [address1, setAddress1] = useState({ address1: "" });
    const [address2, setAddress2] = useState({ address2: "" });

    const [fill, setFill] = useState(false);

    const [nameRegex, setNameRegex] = useState(false);
    const [emailRegex, setEmailRegex] = useState(false);
    const [phoneRegex, setPhoneRegex] = useState(false);

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

    useEffect(() => {
        setFill(
            name.name !== '' &&
            email.email !== '' &&
            phone.phone !== '' &&
            address1.address1 !== '' &&
            address2.address2 !== ''
        );
    }, [name.name, email.email, phone.phone, address1.address1, address2.address2]);

    const navi = useNavigate();

    const handleUpdate = async () => {
        if (!fill) {
            alert('모든 항목을 입력해주세요.');
            return;
        }
        if (!nameRegex) {
            alert('이름은 2~5글자의 한글이어야합니다.');
            return;
        }
        if (!emailRegex) {
            alert('이메일 형식을 올바르게 입력해주세요.');
            return;
        }
        if (!phoneRegex) {
            alert('휴대폰 번호는 숫자 11자리만 입력해주세요.');
            return;
        }
        if (fill && nameRegex && emailRegex && phoneRegex) {
            try {
                const userData = {
                    id: storedLoginId,
                    name: name.name,
                    email: email.email,
                    phone: phone.phone,
                    zipcode: zipcode.zipcode,
                    address1: address1.address1,
                    address2: address2.address2
                };
                await axios.post("/api/member/updateMyInfo", userData);
                alert("회원정보 수정이 완료되었습니다.");
                navi("/mypage");
                window.location.reload();
            } catch (error) {
                console.log("수정 실패", error);
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
        //zipcode.zipcode = data.zonecode;
        //address1.address1 = addr + extraAddr;
        // 커서를 상세주소 필드로 이동한다.
        document.getElementById("sample6_detailAddress").focus();

        setShowModal(false);
    }

    const handleOpenModal = () => {
        // 우편번호 찾기 모달 열기
        setShowModal(true);
    };

    return (
        <div className={style.updContainer}>
            <Link to="/mypage"><button>뒤로가기</button></Link>
            <div>
                이름 : <input type="text" name="name" onChange={handleChangeName} value={name.name}></input>
            </div>
            <div>
                phone : <input type="text" name="phone" onChange={handleChangePhone} value={phone.phone}></input>
            </div>
            <div>
                email : <input type="text" name="email" onChange={handleChangeEmail} value={email.email}></input>
            </div>
            <div>
                우편번호 : <input type="text" name="zipcode" id="sample6_postcode" readOnly onChange={handleChangeZipcode} value={zipcode.zipcode}></input>
                <input type="button" value="우편번호 찾기" onClick={handleOpenModal}></input><br></br>
            </div>
            <div>
                주소<input type="text" name="address1" id="sample6_address" readOnly onChange={handleChangeAddress1} value={address1.address1}></input>
            </div>
            <div>
                <input type="text" name="address2" id="sample6_detailAddress" onChange={handleChangeAddress2} value={address2.address2}></input>
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
                        padding:'0px',
                        overflow:'none'
                    }
                }}
            >
                <DaumPostcode onComplete={handleComplete} />
            </Modal>
            <button onClick={handleUpdate}>회원정보 수정하기</button>
        </div>
    );
}

export default UpdateMyInfo;