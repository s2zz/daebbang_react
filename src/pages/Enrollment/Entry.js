import 'bootstrap/dist/css/bootstrap.min.css';
import signupImage from './assets/signup.png';
import successImage from './assets/success.png';
import style from "./Enrollment.module.css"
import { Link } from 'react-router-dom';
import Footer from "../commons/Footer";
import React, { useEffect } from 'react';

const Entry = () => {
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080');

    socket.onopen = () => {
      console.log('WebSocket 연결 성공!');
      // 연결이 열렸을 때 수행할 작업들
    };

    socket.onerror = (error) => {
      console.error('WebSocket 연결 실패: ', error);
      // 연결 에러 발생 시 처리
    };

    socket.onmessage = (event) => {
      console.log('메시지 수신:', event.data);
      // 수신한 데이터 처리 로직
    };

    return () => {
      socket.close();
      console.log('WebSocket 연결 종료');
      // 컴포넌트가 언마운트되면 소켓 연결 종료
    };
  }, []);

  return (
    <div className={style.container}>
      <div className={style.imgbag} style={{padding:"50px"}}>
        <img style={{width:'50%'}} className={style.img} src={signupImage} alt="이미지 설명" />
      </div>
      <div>
        <img style={{width:'100%'}} src={successImage} alt="이미지 설명" />
      </div>
      <div style={{display:'flex', justifyContent:'center',marginTop:'20px'}}>
        <Link to={`/`}>&raquo; 홈으로 돌아가기</Link>
      </div>
      <div>
      <Footer/>
      </div>
    </div>
  );
}

export default Entry;
