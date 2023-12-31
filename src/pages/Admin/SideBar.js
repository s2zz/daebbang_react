import { Link, useLocation } from 'react-router-dom';
import style from "./SideBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars,faUser,faHouse,faFileAlt, faQuestion, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
const SideBar = () => {
    const location = useLocation();

    return (
        <div style={{position:'fixed'}}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin' && style.selected}`} to="/admin">
                    <FontAwesomeIcon className={style.fontawe} icon={faBars} /> 대시보드
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toMemberManagement' && style.selected}`} to="/admin/toMemberManagement">
                    <FontAwesomeIcon className={style.fontawe} icon={faUser} /> 회원 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toAgentManagement' && style.selected}`} to="/admin/toAgentManagement">
                    <FontAwesomeIcon className={style.fontawe} icon={faHouse} /> 공인중개사 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toEstateManagement' && style.selected}`} to="/admin/toEstateManagement">
                    <FontAwesomeIcon className={style.fontawe} icon={faFileAlt} /> 매물 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toNotificationManagement' && style.selected}`} to="/admin/toNotificationManagement">
                    <FontAwesomeIcon className={style.fontawe} icon={faQuestion} /> 문의 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toReportManagement' && style.selected}`} to="/admin/toReportManagement">
                    <FontAwesomeIcon className={style.fontawe} icon={faCircleExclamation} /> 신고 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/admin/toBanAgent' && style.selected}`} to="/admin/toBanAgent">
                    <FontAwesomeIcon className={style.fontawe} icon={faCircleExclamation} /> 중개사무소 정지 관리
                </Link>
            </div>
        </div>
    );
}

export default SideBar;