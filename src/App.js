import './App.css';

import { BrowserRouter, Routes, Route} from 'react-router-dom';
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

function App() {
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
          <Route path="/login/findId/*" element={<FindId/>} />
          <Route path="/login/findPw/*" element={<FindPw/>} />
          <Route path="/signUp/*" element={<SignUp/>} />
          <Route path="/myPage/*" element={<MyPage/>} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/enrollment/*" element={<Enrollment />} />
        </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;