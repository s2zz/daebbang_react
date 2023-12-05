import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopForm from './pages/commons/TopForm';
import Main from './pages/main/main';


function App() {
  return (
    <div className="container">
      <TopForm />
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Main />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
