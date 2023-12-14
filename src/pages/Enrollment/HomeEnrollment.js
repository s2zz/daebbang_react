import React, { useState, useEffect } from 'react';
import style from "./Enrollment.module.css"
import enrollImage from './assets/enroll.png';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Footer from "../commons/Footer";

const HomeEnrollment = (args) => {
    const [value, setValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [nameValue, setNameValue] = useState('');
    //모달
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    //api
    const [data, setData] = useState([]); // Store fetched data
    const [pageNo, setPageNo] = useState(1); // Track page number
    const [loading, setLoading] = useState(false);
    //api 검색결과
    const [searchValue, setSearchValue] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    //api 선택된 값
    const [selectedItem, setSelectedItem] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null); // 마우스가 올라간 아이템
    const navigate = useNavigate();

    const handleApiInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    // 중개사무소 찾기 버튼 클릭 시 데이터 가져오기
    const handleButtonClick = () => {
        toggle(); // 모달 열기/닫기
        setSearchResult(null);
        setSearchValue(null);

    };

    const searchButtonClick = () => {
        axios.get(`/api/admin/openApi/${searchValue}`)
            .then(response => {
                setSearchResult(response.data.EDOffices.field);
            })
            .catch(error => {
                console.error("에러 발생: ", error);
            });
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchButtonClick();
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, '');;

        if (inputValue.length <= 11) {
            setValue(inputValue);
        }
    };

    const handleSelectChange = (e) => {
        setSelectedValue(e.target.value);
    };

    const handleItemClick = (item) => {
        axios.get(`/api/admin/agent/isEstateNumber/${item.jurirno}`)
            .then(response => {
                console.log(response.data);
                if (response.data) {
                    setSelectedItem('');
                    alert("이미 가입된 공인중개사무소 입니다.")
                }else{
                    setSelectedItem(item);
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
    const handleSubmit = () => {
        if (!selectedItem || !value || !nameValue || !emailValue || !selectedValue) {
            alert('모든 필드를 입력해주세요.');
        } else {
            const formData = new FormData();

            // 사용자가 입력한 정보 추가
            formData.append('estateName', selectedItem.bsnmCmpnm);
            formData.append('estateNumber', selectedItem.jurirno);
            formData.append('name', nameValue);
            formData.append('phone', value);
            formData.append('pw', value);
            formData.append('role', 'ROLE_AGENT');
            formData.append('email', emailValue + "@" + selectedValue);
            // 다른 필드 추가 가능

            // axios를 사용하여 FormData를 서버로 전송
            axios
                .post('/api/admin/agent/signup', formData)
                .then(response => {
                    alert('임시 비밀번호는 전화번호 입니다. 승인완료가 되면 빠른시간내에 비밀번호 변경 해주세요.');
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
        }
    };

    const handleNameChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            const regex = /^[ㄱ-힣]{0,5}$/; // 글자 수 범위 수정 (0에서 5 사이)

            if (regex.test(value)) {
                setNameValue(value);
            }
        }
    };

    return (
        <div className={style.container}>
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
                                <Button color="danger" onClick={handleButtonClick}>
                                    중개사무소 찾기
                                </Button>
                                <div>
                                    {selectedItem && (
                                        <div style={{ marginTop: '10px' }}>
                                            <input value={selectedItem.bsnmCmpnm} disabled />
                                        </div>
                                    )}
                                </div>

                                <Modal isOpen={modal} toggle={toggle} className="style.custom-modal" {...args}>
                                    <ModalHeader toggle={toggle}>중개사무소 찾기</ModalHeader>
                                    <ModalBody>
                                        <input
                                            type="text"
                                            placeholder='예) 대빵 공인중개사'
                                            value={searchValue || ''}
                                            onChange={handleApiInputChange}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <button onClick={searchButtonClick}>검색</button>
                                        {searchResult !== null ? (
                                            // map 함수를 호출하는 부분
                                            <div style={{ overflowY: 'scroll', maxHeight: '300px' }}>
                                                {searchResult.map((item, index) => (
                                                    <div key={index}>
                                                        <p
                                                            onClick={() => handleItemClick(item)}
                                                            onMouseEnter={() => handleMouseEnter(item)}
                                                            onMouseLeave={handleMouseLeave}
                                                            style={{
                                                                cursor: 'pointer', // 마우스 커서 스타일
                                                                backgroundColor: hoveredItem === item ? 'lightgray' : 'white', // 배경색 변경
                                                            }}
                                                        >
                                                            {item.bsnmCmpnm}

                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            // searchResult가 null인 경우 표시할 내용
                                            <p>중개사무소 이름은 브이월드의 부동산중개업 정보에 등록된 정보를 검색할 수 있습니다.<br></br>
                                                중개사무소가 검색되지 않을 경우010-3470-1399로 문의주세요.</p>
                                        )}

                                    </ModalBody>
                                </Modal>
                            </div>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표공인중개사 휴대폰 번호</h5>
                            <input type="text" placeholder='예) 01012345678' value={value} onChange={handleInputChange}></input>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표이름</h5>
                            <input
                                type="text"
                                placeholder="이름을 입력하세요."
                                value={nameValue}
                                name='name'
                                onChange={handleNameChange}
                            />

                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표공인중개사 이메일</h5>
                            <div className={style.nextId}>
                                <input
                                    type="text"
                                    placeholder='이메일을 입력하세요.'
                                    value={emailValue}
                                    onChange={handleEmailChange}
                                />
                                <span style={{ marginLeft: '5px', marginRight: '5px' }}>@</span>
                                <select value={selectedValue} onChange={handleSelectChange}>
                                    <option value="">선택하세요</option>
                                    <option value="naver.com">naver.com</option>
                                    <option value="hanmail.net">hanmail.net</option>
                                    <option value="daum.net">daum.net</option>
                                    <option value="nate.com">nate.com</option>
                                    <option value="gmail.com">gmail.com</option>
                                </select>
                            </div>
                            <p className={style.flex}>가입 후 아이디로 이용됩니다</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginBottom: "20px" }}>
                <Button onClick={handleSubmit}>
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
