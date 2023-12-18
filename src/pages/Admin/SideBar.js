import { Link } from 'react-router-dom';
import style from "./SideBar.module.css";
const SideBar = () => {
    return (
        <>
            <div className={style.menu}>
                <Link className={style.link} to="/admin">&raquo; 메인페이지</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toMemberManagement">&raquo; 회원 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toAgentManagement">&raquo; 공인중개사 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toNotificationManagement">&raquo; 리뷰 관리</Link>
            </div>
        </>
    );
}
export default SideBar;