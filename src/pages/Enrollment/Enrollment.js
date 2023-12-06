import React, { useState } from 'react';
import style from "./Enrollment.module.css"
import enrollImage from './assets/enroll.png';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const BootstrapButton = styled(Button)({
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '6px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
        backgroundColor: '#0069d9',
        borderColor: '#0062cc',
        boxShadow: 'none',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: '#0062cc',
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
});

const Enrollment = () => {
    const [value, setValue] = useState('');
    const [selectedValue, setSelectedValue] = useState('');

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

    const agentLayerShow = (e) => {
        console.log('중개사무소 정보를 표시합니다.');

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
                            <button onClick={agentLayerShow} style={{padding:'3px'}}>중개사무소 찾기</button>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list}>대표공인중개사 휴대폰 번호</h5>
                            <input type="text" placeholder='전화번호를 입력하세요.' value={value} onChange={handleInputChange}></input>
                        </li>
                        <hr></hr>
                        <li>
                            <h5 className={style.list} style={{marginBottom:'0px'}}>대표공인중개사 이메일</h5>
                            <div className={style.nextId}>
                                <input type="text" placeholder='이메일을 입력하세요.'></input>
                                <span style={{marginLeft:'5px',marginRight:'5px'}}>@</span>
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
                <BootstrapButton variant="contained" disableRipple>
                    가입 신청하기
                </BootstrapButton>
            </div>
        </div>
    );
};

export default Enrollment;
