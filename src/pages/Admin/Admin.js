import { Route, Routes } from 'react-router-dom';
import style from "./Admin.module.css";
import SideBar from './SideBar';
import AdminMain from './AdminMain';
const Admin = () => {
    return (
        <div className={style.AdminContainer}>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div>
                <Routes>
                    <Route path="/" element={<AdminMain />}></Route>
                </Routes>
            </div>
        </div >
    );
}
export default Admin;