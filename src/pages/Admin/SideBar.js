import { Link } from 'react-router-dom';
const SideBar = () => {
    return (
        <>
            <div>
                <Link to="/admin">메인페이지</Link>
            </div>
            <div>
                <Link to="/admin/toAgentManagement">회원 관리</Link>
            </div>
            <div>
                <Link to="/admin/toMemberManagement">공인중개사 관리</Link>
            </div>
            <div>
                <Link to="/admin/toNotificationManagement">신고 관리</Link>
            </div>
            
        </>
    );
}
export default SideBar;