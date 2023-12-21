import { Link } from 'react-router-dom';
import style from "../css/SideBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
const SideBar = () => {
    return (
        <>
            <div className={style.menu}>
                <Link className={style.link} to="/estateManage/"><FontAwesomeIcon icon={faAnglesRight} /> 매물 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/estateManage/reviewApproval"><FontAwesomeIcon icon={faAnglesRight} /> 리뷰 관리</Link>
            </div>
            <div className={style.menu}>
                <Link className={style.link} to="/estateManage/estateInsert"><FontAwesomeIcon icon={faAnglesRight} /> 방 내놓기</Link>
            </div>
        </>
    );
}
export default SideBar;