import { Link, useLocation } from 'react-router-dom';
import style from "../css/SideBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPen, faHouse} from "@fortawesome/free-solid-svg-icons";
const SideBar = () => {
    const location = useLocation();

    return (
        <div style={{ position: 'fixed' }}>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/estateManage' && style.selected}`} to="/estateManage">
                    <FontAwesomeIcon className={style.fontawe} icon={faList} /> 매물 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/estateManage/reviewApproval' && style.selected}`} to="/estateManage/reviewApproval">
                    <FontAwesomeIcon className={style.fontawe} icon={faPen} /> 리뷰 관리
                </Link>
            </div>
            <div className={style.menu}>
                <Link className={`${style.link} ${location.pathname === '/estateManage/estateInsert' && style.selected}`} to="/estateManage/estateInsert">
                    <FontAwesomeIcon className={style.fontawe} icon={faHouse} /> 방 내놓기
                </Link>
            </div>
        </div>
    );
}

export default SideBar;