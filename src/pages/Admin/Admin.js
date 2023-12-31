import { Route, Routes } from 'react-router-dom';
import style from "./Admin.module.css";
import SideBar from './SideBar';
import AdminDashboard from './AdminDashboard';
import AdminMain from './AdminMain';
import AgentManagement from './AgentManagement';
import MemberManagement from './MemberManagement';
import NotificationManagement from './NotificationManagement';
import ReportManagement from './ReportManagement';
import EstateManagement from './EstateManagement';
import BanAgent from './BanAgent';

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
                    <Route path="/toReportManagement" element={<ReportManagement />}></Route>
                    <Route path="/toEstateManagement" element={<EstateManagement />}></Route>
                    <Route path="/toBanAgent" element={<BanAgent />}></Route>
                </Routes>
            </div>
        </div >
    );
}
export default Admin;