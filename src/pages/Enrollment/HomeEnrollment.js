import React, { useState, useEffect } from 'react';
import style from "./Enrollment.module.css"
import enrollImage from './assets/enroll.png';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

// function fetchData(pageNo) {
//     const pageSize = 100; // 페이지 크기 설정 (적절한 값으로 변경)

//     axios.get("/api/admin/openApi", {
//         params: {
//             pageNo: pageNo,
//             pageSize: pageSize,
//             bsnmCmpnm: "신흥사부동산중개인사무소",
//         }
//     })
//         .then(response => {
//             // console.log(response.data.EDOffices.field);
//             response.data.EDOffices.field.map((item, index) => {
//                 // 각 객체에 접근하는 로직을 여기에 구현
//                 console.log(`Index ${index}:`, item.bsnmCmpnm); // 각 객체에 대한 작업 수행
//             });


//             // 데이터가 더 이상 없는지 확인
//             if (response.data.EDOffices.field.length === pageSize) {
//                 fetchData(pageNo + 1); // 데이터가 있으면 다음 페이지 호출
//             } else {
//                 console.log("No more data available");
//             }
//         })
//         .catch(error => {
//             console.error("There was a problem with the axios request:", error);
//         });
// }

// // 첫 번째 페이지에서 호출을 시작하려면 아래와 같이 하세요
// fetchData(1);
axios.get("/api/admin/openApi")
    .then(response => {
        console.log(response.data);
    })


const HomeEnrollment = (args) => {
    const [value, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    //모달
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    //api
    const [data, setData] = useState([]); // Store fetched data
    const [pageNo, setPageNo] = useState(1); // Track page number
    const [loading, setLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const fetchData = (page) => {
        setLoading(true);
        const pageSize = 100;

        axios.get("/api/admin/openApi", {
            params: {
                pageNo: page,
                pageSize: pageSize
            }
        })
            .then(response => {
                // Assuming response.data.EDOffices.field contains the data
                const newData = response.data.EDOffices.field;
                setData(prevData => [...prevData, ...newData]); // Append new data to existing data
                setLoading(false);
                setPageNo(page + 1); // Increment page number for the next fetch
                console.log(data);
            })
            .catch(error => {
                console.error("There was a problem with the axios request:", error);
                setLoading(false);
            });
    };
    const filterData = () => {
        // 사용자가 입력한 값을 기준으로 데이터를 필터링하고, 검색어가 포함된 결과만 반환합니다.
        return data.filter(item => {
            // 검색어가 없거나 해당 아이템의 필드 중에서 검색어가 포함된 것을 찾습니다. 여기서는 bsnmCmpnm 필드를 검색어로 활용하겠어요.
            return !searchValue || item.bsnmCmpnm.toLowerCase().includes(searchValue.toLowerCase());
        });
    };

    const handleApiInputChange = (e) => {
        setSearchValue(e.target.value);
    };

    // 중개사무소 찾기 버튼 클릭 시 데이터 가져오기
    const handleButtonClick = () => {
        toggle(); // 모달 열기/닫기

    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, '');;

        if (inputValue.length <= 11) {
            setValue(inputValue);
        }
    };

    const handleSelectChange = (e) => {
        setSelectedValue(e.target.value);
        console.log('선택된 값:', e.target.value);
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
                        <p style={{ marginTop: '5px' }}><strong style={{ fontSize: '13px' }}>국가공간정보포털의 부동산중개업 정보에 등록된 대표 공인중개사만 회원가입이 가능합니다.</strong></p>
                    </div>
                    <ul className={style.baggray}>
                        <li>
                            <h5 className={style.list}>중개사무소 정보</h5>
                            <div>
                                <Button color="danger" onClick={handleButtonClick}>
                                    중개사무소 찾기
                                </Button>

                                <Modal isOpen={modal} toggle={toggle} className="style.custom-modal" {...args}>
                                    <ModalHeader toggle={toggle}>중개사무소 찾기</ModalHeader>
                                    <ModalBody>
                                        <input
                                            type="text"
                                            placeholder='예) 종로 베스트공인 김대방'
                                            value={searchValue}
                                            onChange={handleApiInputChange}
                                        />
                                        {filterData().map((item, index) => (
                                            <div key={index}>
                                                {/* Displaying data fields from each item */}
                                                <p>{item.bsnmCmpnm}</p> {/* 혹시 이 부분에서 다른 속성으로 바꿔야 하는지 확인해주세요 */}
                                                {/* Add other data fields as needed */}
                                            </div>
                                        ))}
                                    </ModalBody>



                                    <ModalFooter>
                                        <Button color="primary" onClick={toggle}>
                                            Do Something
                                        </Button>{' '}
                                        <Button color="secondary" onClick={toggle}>
                                            Cancel
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표공인중개사 휴대폰 번호</h5>
                            <input type="text" placeholder='전화번호를 입력하세요.' value={value} onChange={handleInputChange}></input>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list} style={{ marginBottom: '0px' }}>대표공인중개사 이메일</h5>
                            <div className={style.nextId}>
                                <input type="text" placeholder='이메일을 입력하세요.'></input>
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
                <Button>
                    <Link to="/enrollment/entry">가입 신청하기</Link>
                </Button>
            </div>
        </div>
    );
};

export default HomeEnrollment;
