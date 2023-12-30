import React, { useState, useEffect } from 'react';
import style from "./Enrollment.module.css"
import enrollImage from './assets/enroll.png';
import marker from './assets/marker.png';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Footer from "../commons/Footer";
import DaumPostcode from "react-daum-postcode";
import { MapMarker, Map } from "react-kakao-maps-sdk";
import style1 from "../commons/Modal.module.css";
import Loading from '../commons/Loading';

const HomeEnrollment = (args) => {


    const [value, setValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    const [loading, setLoading] = useState(true);
    //모달
    const [modal, setModal] = useState(false);
    const toggle = () => {
        setModal(!modal);
        setShowAddress(false);
    };
    //api 검색결과
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    //api 선택된 값
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null); // 마우스가 올라간 아이템

    const [address, setAddress] = useState('');
    const [xValue, setXValue] = useState('');
    const [yValue, setYValue] = useState('');

    const [showAddress, setShowAddress] = useState(false);
    const [showAddressInfo, setShowAddressInfo] = useState(false);


    //카카오 우편
    const [fill, setFill] = useState(false);
    const [showAddressInputs, setShowAddressInputs] = useState(false);
    const [zipcode, setZipcode] = useState({ zipcode: "" });
    const [address1, setAddress1] = useState({ address1: "" });
    const [address2, setAddress2] = useState({ address2: "" });
    //alert창
    const [modal3, setModal3] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const toggle3 = () => setModal3(!modal3);

    const handleAlert = (message) => {
        setAlertMessage(message);
        toggle3();
    };


    const { kakao } = window;

    var ps = new kakao.maps.services.Places();
    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces(key_word) {
        var keyword = key_word;

        // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
        ps.keywordSearch(keyword, function (data, status, pagination) {
            var dataLength = Object.keys(data).length;

            if (!dataLength) {
                alert("주소를 수동으로 입력해주세요.");
                setShowAddressInputs(true);
                setShowAddress(false);
                setShowAddressInfo(false);
            } else if (dataLength) {

                setShowAddressInputs(false);
                setShowAddressInfo(true);
                if (status === kakao.maps.services.Status.OK) {
                    setShowAddress(true);
                    setXValue(data[0].x);
                    setYValue(data[0].y);
                    setAddress(data[0].address_name);
                }
            }
        });
    }

    const navigate = useNavigate();

    const handleApiInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    // 중개사무소 찾기 버튼 클릭 시 데이터 가져오기
    const handleButtonClick = () => {
        toggle(); // 모달 열기/닫기
        setSearchResult(null);
        setSearchValue(null);
        setShowAddressInputs(false);
        setShowAddressInfo(false);
    };

    const searchButtonClick = () => {
        axios.get(`/api/enrollment/openApi/${searchValue}`)
            .then(response => {
                setSearchResult(response.data.EDOffices.field);
                setLoading(false);
            })
            .catch(error => {
                alert("해당 중개사무소가 없습니다. 계속 반복되 경우 고객센터로 문의 바랍니다.");
            });
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchButtonClick();
        }
    };

    // const handleInputChange = (e) => {
    //     const inputValue = e.target.value.replace(/\D/g, '');;

    //     if (inputValue.length <= 11) {
    //         setValue(inputValue);
    //     }
    // };

    const handleSelectChange = (e) => {
        setSelectedValue(e.target.value);
    };


    //전화번호
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
    const phone = `${selectedPhoneValue}-${phoneValue}-${phoneValue1}`;
    console.log(pw + ":" + phone);

    /////////////////////////////////////////////////////////////////////////
    const handleItemClick = (item) => {
        axios.get(`/api/enrollment/agent/isEstateNumber/${item.jurirno}`)
            .then(response => {
                if (response.data) {
                    setSelectedItem('');
                    alert("이미 가입된 공인중개사무소 입니다.")
                } else {
                    setSelectedItem(item);
                    searchPlaces(item.ldCodeNm + " " + item.bsnmCmpnm);
                }

            })
            .catch(error => {
                console.error("에러 발생: ", error);
            });
        toggle();
    };
    const handleMouseEnter = (item) => {
        setHoveredItem(item);
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };
    const increaseNewEstateCount = async () => {
        try {
            const response = await axios.get('/api/enrollment/agent/todayNewEstate');
            if (response.data) {
                // 해당 데이터의 방문자 수 증가 요청 (PUT 요청)
                await axios.put(`/api/enrollment/agent/incrementNewEstate/${response.data.seq}`);
            } else {
                // 오늘 날짜의 데이터가 없는 경우 새로운 데이터 삽입 (POST 요청)
                await axios.post('/api/enrollment/agent/createNewEstate');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleSubmit = () => {


        if (!selectedItem) {
            alert('중개사무소를 선택해주세요.');
        } else if (!phoneValue || !phoneValue1) {
            alert('대표공인중개사 휴대폰 번호를 입력해주세요.');
        } else if (!nameValue) {
            alert('대표이름을 입력해주세요.');
        } else if (!emailValue || !selectedValue) {
            alert('대표공인중개사 이메일을 입력해주세요.');
        } else if (!address && (!address1.address1 || !address2.address2)) {
            alert('주소를 입력해주세요. 중개사무소 찾기를 눌러서 주소를 입력하거나 우편번호 찾기를 이용해주세요.');
        } else {
            //전화번호
            const maxLength = selectedPhoneValue === '010' ? 4 : 3;

            if (phoneValue.length !== maxLength || phoneValue1.length !== 4) {
                if (phoneValue.length !== maxLength) {
                    alert(`phoneValue는 ${maxLength}글자만 입력 가능합니다.`);
                }
                if (phoneValue1.length !== 4) {
                    alert('phoneValue1은 4글자만 입력 가능합니다.');
                }
                return;
            }

            const formData = new FormData();
            let addressValue = '';

            if (address) {
                addressValue = address;
            } else if (address1.address1) {
                addressValue = address1.address1 + " " + address2.address2 + "";
            } else {
                alert('중개사무소 찾기를 눌러주세요.');
                return;
            }

            const xValueToSend = xValue || 0;
            const yValueToSend = yValue || 0;

            formData.append('address', addressValue);
            formData.append('longitude', xValueToSend);
            formData.append('latitude', yValueToSend);
            formData.append('estateName', selectedItem.bsnmCmpnm);
            formData.append('estateNumber', selectedItem.jurirno);
            formData.append('name', nameValue);
            formData.append('phone', phone);
            formData.append('pw', pw);
            formData.append('role', 'ROLE_AGENT');
            formData.append('email', emailValue + "@" + selectedValue);

            axios
                .post('/api/enrollment/agent/signup', formData)
                .then(response => {
                    alert('임시 비밀번호는 전화번호 입니다. 승인완료가 되면 빠른시간내에 비밀번호 변경 해주세요.');
                    increaseNewEstateCount();
                    navigate('/enrollment/entry');
                })
                .catch(error => {
                    console.error('회원가입 에러:', error);
                });
        }
    };

    const handleEmailChange = (e) => {
        const inputValue = e.target.value;
        const regex = /^[^\u3131-\u3163\uac00-\ud7a3]*$/;

        if (regex.test(inputValue)) {
            setEmailValue(inputValue);
        }else{
            alert("영어 또는 특수문자만 입력가능합니다.");
        }
    };

    

    const handleNameChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const regex = /^[ㄱ-힣]{0,5}$/; // 글자 수 범위 수정 (0에서 5 사이)

            if (regex.test(value)) {
                setNameValue(value);
            }else{
                alert("한글만 입력 가능합니다.");
            }
        }
    };


    //카카오 우편 api
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
    //우편 api 모달창
    const [modal1, setModal1] = useState(false);

    const toggle1 = () => setModal1(!modal1);

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
        // 커서를 상세주소 필드로 이동한다.
        document.getElementById("sample6_detailAddress").focus();

        toggle1(false);
    }


    return (
        <div className={style.container}>
            {modal3 && <div>
                <Modal isOpen={modal3} toggle={toggle3} backdrop={false} className={style1.alert}>
                    <ModalBody className={style1.alertBody}>
                        <p className={style1.alertContents}>{alertMessage}</p>
                        <br></br>
                        <Button color="primary" style={{ fontSize: 'small' }} className={style1.alertBtn} onClick={toggle3} >
                            확인
                        </Button>{' '}
                    </ModalBody>
                </Modal>
            </div>}
            <div className={style.imgbag}>
                <img className={style.img} src={enrollImage} alt="이미지 설명" />
            </div>

            <div className={style.box}>
                <div>
                    <div>
                        <h4 style={{ marginBottom: '0px' }}>&raquo; 필수 입력사항</h4>
                        <p style={{ marginTop: '5px' }}><strong style={{ fontSize: '13px' }}>브이월드의 부동산중개업 정보에 등록된 대표 공인중개사만 회원가입이 가능합니다.</strong></p>
                    </div>
                    <ul className={style.baggray}>
                        <li>
                            <h5 className={style.list}>중개사무소 정보</h5>
                            <div>
                                <Button style={{ fontFamily: 'NanumBarunGothic' }} onClick={handleButtonClick}>
                                    중개사무소 찾기
                                </Button>
                                <div>
                                    {selectedItem && (
                                        <div style={{ marginTop: '10px' }}>
                                            {showAddressInfo && (
                                                <div>
                                                    <input className={style.input_style} value={selectedItem.bsnmCmpnm} disabled style={{ width: '210px', textAlign: 'center' }} />
                                                    <input className={style.input_style} value={address} disabled style={{ width: '300px', textAlign: 'center' }} />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {showAddressInputs && (
                                        <div>
                                            <input type="text" style={{ marginBottom: '1%', marginRight: '1%' }} name="zipcode" id="sample6_postcode" placeholder="우편번호" readOnly onChange={handleChangeZipcode} value={zipcode.zipcode} className={[style.inputInfo, style.inputZip, style.input_style].join(' ')} />
                                            <Button type="button" onClick={toggle1}>
                                                우편번호 찾기
                                            </Button>
                                            <br></br>
                                            <div className={style.blank}></div>
                                            <input type="text" style={{ marginBottom: '1%' }} name="address1" id="sample6_address" placeholder="주소" readOnly onChange={handleChangeAddress1} value={address1.address1} className={[style.inputInfo, style.inputAddr, style.input_style].join(' ')} /><br></br>
                                            <div className={style.blank}></div>
                                            <input type="text" style={{ marginBottom: '1%' }} name="address2" id="sample6_detailAddress" placeholder="상세주소" onChange={handleChangeAddress2} value={address2.address2} className={[style.inputInfo, style.inputAddr, style.input_style].join(' ')} />
                                        </div>
                                    )}

                                    {/* 모달 */}
                                    <Modal isOpen={modal1} toggle={toggle1}>
                                        <ModalBody>
                                            <DaumPostcode onComplete={handleComplete} />
                                        </ModalBody>
                                    </Modal>
                                </div>
                                <div style={{ marginTop: '2%' }}>
                                    {showAddress && (
                                        <Map // 지도를 표시할 Container
                                            center={{
                                                // 지도의 중심좌표
                                                lat: yValue,
                                                lng: xValue,
                                            }}
                                            style={{
                                                // 지도의 크기
                                                width: "100%",
                                                height: "450px",
                                            }}
                                            level={4} // 지도의 확대 레벨
                                        >
                                            <MapMarker // 마커를 생성합니다
                                                position={{
                                                    // 마커가 표시될 위치입니다
                                                    lat: yValue,
                                                    lng: xValue,
                                                }}
                                                image={{
                                                    src: marker, // 마커이미지의 주소입니다
                                                    size: {
                                                        width: 54,
                                                        height: 59,
                                                    }, // 마커이미지의 크기입니다
                                                    options: {
                                                        offset: {
                                                            x: 27,
                                                            y: 69,
                                                        }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
                                                    },
                                                }}
                                            />
                                        </Map>
                                    )}
                                </div>
                                <Modal isOpen={modal} toggle={toggle} className="style.custom-modal" {...args}>
                                    <ModalHeader className={style.font} toggle={toggle}>중개사무소 찾기</ModalHeader>
                                    <ModalBody>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2%' }}>
                                            <input
                                                className={style.input_style}
                                                type="text"
                                                placeholder='예) 대빵 공인중개사'
                                                value={searchValue || ''}
                                                onChange={handleApiInputChange}
                                                onKeyDown={handleKeyDown}
                                            />
                                            <Button style={{ marginLeft: '2%' }} outline onClick={searchButtonClick} >검색</Button>
                                        </div>

                                        {searchResult !== null ? (
                                            // map 함수를 호출하는 부분
                                            <div>
                                                {loading ? (
                                                    <Loading />
                                                ) : (
                                                    <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
                                                        {searchResult.map((item, index) => (
                                                            <div key={index}>
                                                                <p
                                                                    onClick={() => handleItemClick(item)}
                                                                    onMouseEnter={() => handleMouseEnter(item)}
                                                                    onMouseLeave={handleMouseLeave}
                                                                    className={style.inline}
                                                                    style={{
                                                                        cursor: 'pointer', // 마우스 커서 스타일
                                                                        backgroundColor: hoveredItem === item ? '#dae3f3' : 'white', // 배경색 변경
                                                                    }}
                                                                >
                                                                    {item.bsnmCmpnm}

                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className={style.fontLight} style={{ padding: '1%' }}>중개사무소 이름은 브이월드의 부동산중개업 정보에 등록된<br></br> 정보를 검색할 수 있습니다.<br></br>
                                                중개사무소가 검색되지 않을 경우 010-3470-1399로 문의주세요.</p>
                                        )}

                                    </ModalBody>
                                </Modal>
                            </div>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표 공인중개사 휴대폰 번호</h5>
                            {/* 전화번호 */}
                            {/* <input className={style.input_style} type="text" placeholder='- 빼고 입력해주세요.' value={value} onChange={handleInputChange} /> */}
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
                                    className={style.input_style}
                                    type="text"
                                    placeholder={selectedPhoneValue == '010' ? '0000' : '000'}
                                    value={phoneValue}
                                    onChange={handlePhoneChange}
                                    name="phoneValue"
                                    style={{ maxWidth: '90px', textAlign: 'center' }}
                                />
                                <span style={{ marginLeft: '5px', marginRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</span>
                                <input
                                    className={style.input_style}
                                    type="text"
                                    placeholder='0000'
                                    value={phoneValue1}
                                    onChange={handlePhoneChange}
                                    name="phoneValue1"
                                    style={{ maxWidth: '90px', textAlign: 'center' }}
                                />
                            </div>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표 이름</h5>
                            <input
                                className={style.input_style}
                                type="text"
                                placeholder="이름을 입력하세요."
                                value={nameValue}
                                name='name'
                                onChange={handleNameChange}
                            />

                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표 공인중개사 이메일</h5>
                            <div className={style.nextId}>
                                <input
                                    className={style.input_style}
                                    type="text"
                                    placeholder='이메일을 입력하세요.'
                                    value={emailValue}
                                    onChange={handleEmailChange}
                                />
                                <span style={{ marginLeft: '5px', marginRight: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>@</span>
                                <select className={style.select_style} value={selectedValue} onChange={handleSelectChange}>
                                    <option value="">선택하세요</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                </select>
                            </div>
                            <p className={style.flex}>가입 후 아이디로 이용됩니다.</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: '2%', marginTop: '2%' }}>
                <Button color='primary' style={{ fontFamily: 'NanumBarunGothic' }} onClick={handleSubmit}>
                    가입 신청하기
                </Button>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    );
};

export default HomeEnrollment;
