import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from '../Login/Login';

const TopForm = () => {
    return (
        <div>
            <Link to="login">로그인</Link>
        </div>
    );
};

export default TopForm;