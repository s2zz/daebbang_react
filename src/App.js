import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopForm from './pages/commons/TopForm';
import Main from './pages/Main/Main';
import Board from './pages/Board/Board';

import LoadEstate from './pages/LoadEstate/LoadEstate';
import AdminMain from './pages/Admin/AdminMain';
import EstateCreate from './pages/EstateManage/EstateCreate';
import Login from './pages/Login/Login';

function App() {
  return (
    <div className="container">
      <TopForm />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} /> 
          <Route path="/board/*" element={<Board/>}/>
          <Route path="/estateManage/*" element={<EstateCreate/>}/>
          <Route path="/loadEstate/*" element={<LoadEstate/>}/>
          <Route path="/login/*" element={<Login/>}/>
          <Route path="/admin/*" element={<AdminMain />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
