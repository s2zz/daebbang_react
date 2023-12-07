import './App.css';
import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import TopForm from './pages/commons/TopForm';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';
import Admin from './pages/Admin/Admin';
import EstateManage from './pages/EstateManage/js/EstateManage';
import Login from './pages/Login/Login';
import Enrollment from './pages/Enrollment/Enrollment';
import SignUp from './pages/SignUp/SignUp';
import Main from './pages/Main/Main';

function App() {
  useEffect(() => {
    // 페이지 로드 시 오늘 날짜 데이터 확인 후 방문자 수 증가 요청
    axios.get('/api/admin/todayVisitor')
      .then(response => {
  
        if (response.data) {
          console.log('Data exists:', response.data.seq);
          // 해당 데이터의 방문자 수 증가 요청 (PUT 요청)
          axios.put(`/api/admin/incrementVisitor/${response.data.seq}`)
            .then(resp => {
              console.log('Visitor count incremented for today');
            })
            .catch(error => {
              console.error('Error incrementing visitor count:', error);
            });
        } else {
          console.log('Data does not exist:', response.data);
          // 오늘 날짜의 데이터가 없는 경우 새로운 데이터 삽입 (POST 요청)
          axios.post('/api/admin/createVisitor')
            .then(resp => {
              console.log('New visitor entry created for today');
            })
            .catch(error => {
              console.error('Error creating new visitor entry:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error checking today\'s visitor data:', error);
      });
  }, []);
  
  
  
  return (
    <BrowserRouter>
      <div className="container">
        <TopForm />
        <div className='body_form'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/board/*" element={<Board />} />
          <Route path="/estateManage/*" element={<EstateManage />} />
          <Route path="/login/*" element={<Login/>} />
          <Route path="/signUp/*" element={<SignUp/>} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/enrollment/*" element={<Enrollment />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
