import { Link } from 'react-router-dom';
import style from "./SideBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
const SideBar = () => {
    return (
        <>
            <div className={style.menu}>
                <Link className={style.link} to="/admin"><FontAwesomeIcon icon={faAnglesRight} /> 메인 페이지</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toMemberManagement"><FontAwesomeIcon icon={faAnglesRight} /> 회원 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toAgentManagement"><FontAwesomeIcon icon={faAnglesRight} /> 공인중개사 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/admin/toNotificationManagement"><FontAwesomeIcon icon={faAnglesRight} /> 리뷰 관리</Link>
            </div>
        </>
    );
}
export default SideBar;