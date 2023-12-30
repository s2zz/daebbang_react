import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import DaumPostcode from "react-daum-postcode";
import style from "./css/UpdateMyInfo.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
// import Swal from 'sweetalert2'

const UpdateMyInfo = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const isEstate = sessionStorage.getItem('isEstate');

    const [name, setName] = useState({ name: "" });
    const [email, setEmail] = useState({ email: "" });
    const [phone, setPhone] = useState({ phone: "" });
    const [zipcode, setZipcode] = useState({ zipcode: "" });
    const [address1, setAddress1] = useState({ address1: "" });
    const [address2, setAddress2] = useState({ address2: "" });
    const [content, setContent] = useState({ content: "" });

    const [fill, setFill] = useState(false);
    const [efill, setEfill] = useState(false);

    const [nameRegex, setNameRegex] = useState(false);
    const [emailRegex, setEmailRegex] = useState(false);
    const [phoneRegex, setPhoneRegex] = useState(false);
    const [contentRegex, setContentRegex] = useState(false);

    const { kakao } = window;
    const [estateGeo, setEstateGeo] = useState({ latitude: '', longitude: '' })

    const handleChangeName = (e) => {
        const { name, value } = e.target;
        setName(prev => ({ ...prev, [name]: value }));

        setFill(e.target.value !== '');
        setEfill(e.target.value !== '');
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

    //new 전화번호 로직
    const [selectedPhoneValue, setSelectedPhoneValue] = useState('010');
    const [phoneValue, setPhoneValue] = useState('');
    const [phoneValue1, setPhoneValue1] = useState('');
    useEffect(() => {
        setSelectedPhoneValue('010');
    }, []);

    const handleSelectPhoneChange = (e) => {
        setSelectedPhoneValue(e.target.value);
    };
    useEffect(() => {
        setPhoneValue('');
        setPhoneValue1('');
    }, [selectedPhoneValue]);

    const handlePhoneChange = (e) => {
        const { name, value } = e.target;

        if (/\D/.test(value)) {
            // 숫자가 아닌 경우
            alert('숫자만 입력 가능합니다.');
            return;
        }

        if (name == 'phoneValue') {
            const maxLength = selectedPhoneValue == '010' ? 4 : 3;
            if (value.length <= maxLength) {
                setPhoneValue(value);
            }
        } else if (name == 'phoneValue1') {
            if (value.length <= 4) {
                setPhoneValue1(value);
            }
        }
    };

    // 전화번호 입력필드 합치기
    const pw = `${selectedPhoneValue}${phoneValue}${phoneValue1}`;
    const newphone = `${selectedPhoneValue}-${phoneValue}-${phoneValue1}`;

    const handleChangeZipcode = (e) => {
        const { name, value } = e.target;
        setZipcode((prev) => ({
            ...prev,
            [name]: value,
            zipcode: document.getElementById('sample6_postcode').value
        }));

        setFill(e.target.value !== '');
        setEfill(e.target.value !== '');
    }

    const handleChangeAddress1 = (e) => {
        const { name, value } = e.target;
        setAddress1((prev) => ({
            ...prev,
            [name]: value,
            address1: document.getElementById("sample6_address").value
        }));

        setFill(e.target.value !== '');
        setEfill(e.target.value !== '');
    }

    useEffect(() => {
        if (address1.address1) {
            handleGeocoding(address1.address1);
        }
    }, [address1.address1]);

    const handleChangeAddress2 = (e) => {
        const { name, value } = e.target;
        setAddress2(prev => ({ ...prev, [name]: value }));

        setFill(e.target.value !== '');
        setEfill(e.target.value !== '');
    }

    const handleChangeContent = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({ ...prev, [name]: value }));

        // const contentRegex = /^.{0,1000}$/;

        // if (contentRegex.test(e.target.value)) {
        //     setContentRegex(true);
        // }
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

    useEffect(() => {
        setEfill(
            name.name !== '' &&
            address1.address1 !== '' &&
            address2.address2 !== '' &&
            phoneValue !== '' &&
            phoneValue1 !== ''
        );
    }, [name.name, address1.address1, address2.address2, phoneValue, phoneValue1]);

    const navi = useNavigate();

    const handleUpdate = async () => {
        if (!fill) {
            alert("모든 항목을 입력해주세요");
            return;
        }
        if (!nameRegex) {
            alert("이름은 2~5글자의 한글이어야합니다.");
            return;
        }
        if (!emailRegex) {
            alert("이메일 형식을 올바르게 입력해주세요.");
            return;
        }
        if (!phoneRegex) {
            alert("휴대폰 번호는 숫자 11자리만 입력해주세요.");
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
                alert("회원정보 수정이 완료되었습니다");
                navi("/mypage");
                window.location.reload();
            } catch (error) {
                console.log("수정 실패", error);
            }
        }
    }

    const handleEstateUpdate = async () => {
        console.log(name.name);
        console.log(newphone);
        console.log(address1.address1 + address2.address2);
        if (!efill) {
            alert("모든 항목을 입력해주세요");
            return;
        }
        if (!nameRegex) {
            alert("이름은 2~5글자의 한글이어야합니다");
            return;
        }
        // if (!contentRegex) {
        //     alert("공인중개사 소개는 1000자 이하로 작성해주세요");
        //     return;
        // }
        if (efill && nameRegex) {
            try {
                const userData = {
                    id: storedLoginId,
                    name: name.name,
                    phone: newphone,
                    address: address1.address1 + address2.address2,
                    latitude: estateGeo.latitude,
                    longitude: estateGeo.longitude,
                    content: content.content
                };
                await axios.post("/api/estate/updateMyInfo", userData);
                alert("공인중개사 정보 수정이 완료되었습니다");
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

    // 좌표 입력
    const handleGeocoding = (address1) => {
        // 주소-좌표 변환 객체를 생성합니다
        const geocoder = new kakao.maps.services.Geocoder();

        // 주소로 좌표를 검색합니다
        geocoder.addressSearch(address1, function (result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

                // 결과값으로 받은 위치를 realEstate 객체에 자동 입력합니다
                setEstateGeo(prevState => ({
                    ...prevState,
                    latitude: result[0].y,
                    longitude: result[0].x
                }));
                // ... (마커, 인포윈도우 설정 등 이전 코드와 동일한 부분)
            }
        });
    };

    return (
        <div className={style.updContainer}>
            <Link to="/mypage"><button className={style.backBtn}><FontAwesomeIcon icon={faArrowLeft} className={style.arrowLeft} /></button></Link>
            <div className={style.titleBox}>
                <div className={style.title}>정보 수정</div>
            </div>
            {!isEstate ?
                <div>
                    <div className={style.inputBox}>
                        <div>
                            이름<br></br>
                            <input type="text" name="name" onChange={handleChangeName} value={name.name} placeholder='이름 입력' className={style.inputInfo}></input><br /><br />
                            휴대전화<br></br>
                            <input type="text" name="phone" onChange={handleChangePhone} value={phone.phone} placeholder='전화번호 입력' className={style.inputInfo}></input><br /><br />
                            이메일<br></br>
                            <input type="text" name="email" onChange={handleChangeEmail} value={email.email} placeholder='이메일 입력' className={style.inputInfo}></input><br /><br />
                            우편번호<br></br>
                            <input type="text" name="zipcode" id="sample6_postcode" readOnly onChange={handleChangeZipcode} value={zipcode.zipcode} className={style.inputZipcode} placeholder='우편번호'></input>
                            <button onClick={handleOpenModal} className={style.zipcodeBtn}>우편번호 찾기</button><br />
                            주소<br></br>
                            <input type="text" name="address1" id="sample6_address" readOnly onChange={handleChangeAddress1} value={address1.address1} placeholder='주소' className={style.inputInfo}></input><br></br>
                            <input type="text" name="address2" id="sample6_detailAddress" onChange={handleChangeAddress2} value={address2.address2} placeholder='상세주소 입력' className={style.inputInfo}></input>
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
                                <DaumPostcode onComplete={handleComplete} />
                            </Modal>
                        </div>
                    </div>
                    <div className={style.changeBtns}>
                        <div>
                            <button onClick={handleUpdate} className={style.changeBtn}>수정 완료</button>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <div className={style.inputBox}>
                        <div>
                            이름<br></br>
                            <input type="text" name="name" onChange={handleChangeName} value={name.name} placeholder='이름 입력' className={style.inputInfo}></input><br /><br />
                            휴대전화<br></br>
                            {/*<input type="text" name="phone" onChange={handleChangePhone} value={phone.phone} placeholder='전화번호 입력' className={style.inputInfo}></input><br /><br />*/}
                            <div className={style.nextId}>
                                <select className={style.select_style} value={selectedPhoneValue} onChange={handleSelectPhoneChange} style={{ maxWidth: '80px' }}>
                                    <option value="010" selected>010</option>
                                    <option value="02">02</option>
                                    <option value="031">031</option>
                                    <option value="032">032</option>
                                    <option value="033">033</option>
                                    <option value="041">041</option>
                                    <option value="042">042</option>
                                    <option value="043">043</option>
                                    <option value="044">044</option>
                                    <option value="051">051</option>
                                    <option value="052">052</option>
                                    <option value="053">053</option>
                                    <option value="054">054</option>
                                    <option value="055">055</option>
                                    <option value="061">061</option>
                                    <option value="062">062</option>
                                    <option value="063">063</option>
                                    <option value="064">064</option>
                                </select>
                                <span style={{ marginLeft: '5px', marginRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</span>
                                <input
                                    className={style.inputInfo}
                                    type="text"
                                    placeholder={selectedPhoneValue == '010' ? '0000' : '000'}
                                    value={phoneValue}
                                    onChange={handlePhoneChange}
                                    name="phoneValue"
                                    style={{ maxWidth: '90px', textAlign: 'center' }}
                                />
                                <span style={{ marginLeft: '5px', marginRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</span>
                                <input
                                    className={style.inputInfo}
                                    type="text"
                                    placeholder='0000'
                                    value={phoneValue1}
                                    onChange={handlePhoneChange}
                                    name="phoneValue1"
                                    style={{ maxWidth: '90px', textAlign: 'center' }}
                                /><br></br>
                            </div>
                            <br/>
                            우편번호<br></br>
                            <input type="text" name="zipcode" id="sample6_postcode" readOnly onChange={handleChangeZipcode} value={zipcode.zipcode} className={style.inputZipcode} placeholder='우편번호'></input>
                            <button onClick={handleOpenModal} className={style.zipcodeBtn}>우편번호 찾기</button><br />
                            주소<br></br>
                            <input type="text" name="address1" id="sample6_address" readOnly onChange={handleChangeAddress1} value={address1.address1} placeholder='주소' className={style.inputInfo}></input><br></br>
                            <input type="text" name="address2" id="sample6_detailAddress" onChange={handleChangeAddress2} value={address2.address2} placeholder='상세주소 입력' className={style.inputInfo}></input><br /><br />
                            공인중개사 소개<br></br>
                            <textarea placeholder='공인중개사를 소개해보세요!' name="content" onChange={handleChangeContent} value={content.content} className={style.estateContent}></textarea>
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
                                <DaumPostcode onComplete={handleComplete} />
                            </Modal>
                        </div>
                    </div>
                    <div className={style.changeBtns}>
                        <div>
                            <button onClick={handleEstateUpdate} className={style.changeEstateBtn}>수정 완료</button>
                        </div>
                    </div>
                </div>

            }


        </div>
    );
}

export default UpdateMyInfo;