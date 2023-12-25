import { Route, Routes } from 'react-router-dom';
import style from "./Admin.module.css";
import SideBar from './SideBar';
import AdminDashboard from './AdminDashboard';
import AdminMain from './AdminMain';
import AgentManagement from './AgentManagement';
import MemberManagement from './MemberManagement';
import NotificationManagement from './NotificationManagement';
import Buttons from './Buttons';

const Admin = () => {
    return (
        <div className={style.adminContainer}>
             <div className={style.sideBar}>
                <SideBar></SideBar>
             </div>
            <div className={style.mainContent}>
                <Routes>
                <Route path="/" element={<AdminDashboard />}></Route>
                    <Route path="/toAdminMain" element={<AdminMain />}></Route>
                    <Route path="/toAgentManagement" element={<AgentManagement />}></Route>
                    <Route path="/toMemberManagement" element={<MemberManagement />}></Route>
                    <Route path="/toNotificationManagement" element={<NotificationManagement />}></Route>
                    <Route path="/toButtons" element={<Buttons />}></Route>
                </Routes>
            </div>
        </div >
    );
}
export default Admin;