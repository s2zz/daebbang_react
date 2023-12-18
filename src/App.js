import './App.css';

import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import TopForm from './pages/commons/TopForm';
import Home from './pages/Home/Home';
import Board from './pages/Board/Board';
import Admin from './pages/Admin/Admin';
import EstateManage from './pages/EstateManage/js/EstateManage';
import Login from './pages/Login/Login';
import Enrollment from './pages/Enrollment/Enrollment';
import SignUp from './pages/SignUp/SignUp';
import MyPage from './pages/MyPage/MyPage';
import Main from './pages/Main/Main';
import FindId from './pages/Login/FindId/FindId';
import FindPw from './pages/Login/FindPw/FindPw';
import React, { useEffect } from 'react';
import axios from 'axios';
import Review from './pages/Review/Review';
import EstateAgent from './pages/EstateAgent/js/EstateAgent';

function App() {
  const storedLoginId = sessionStorage.getItem('loginId');
  const isAdmin = sessionStorage.getItem('isAdmin');
    //방문자수
    useEffect(() => {
      axios.get(`/api/visit/test`).then(resp => {
        
      })
    }, []);
  return (
    <BrowserRouter>
      <div className="main_container">
        <TopForm />
        <div className='body_form'>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home/*" element={<Home />} />
          <Route path="/board/*" element={<Board loginId={storedLoginId} admin={isAdmin}/>} />
          <Route path="/estateManage/*" element={<EstateManage />} />
          <Route path="/login/*" element={<Login/>} />
          <Route path="/login/findId/*" element={<FindId/>} />
          <Route path="/login/findPw/*" element={<FindPw/>} />
          <Route path="/signUp/*" element={<SignUp/>} />
          <Route path="/myPage/*" element={storedLoginId?<MyPage/>:<Navigate to="/" replace/>} />
          <Route path="/admin/*" element={isAdmin?<Admin />:<Navigate to="/" replace/>} />
          <Route path="/enrollment/*" element={<Enrollment />} />
          <Route path="/review/*" element={<Review />} />
          <Route path="/estateAgent/*" element={<EstateAgent />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;