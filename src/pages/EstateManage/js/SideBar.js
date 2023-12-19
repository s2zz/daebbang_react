import { Link } from 'react-router-dom';
const SideBar = () => {
    return (
        <>
            <div>
                <Link to="/estateManage/estateInsert">방내놓기</Link>
            </div>
            <div>
                <Link to="/estateManage/">매물관리</Link>
            </div>
            <div>
                <Link to="/estateManage/reviewApproval">리뷰관리</Link>
            </div>
        </>
    );
}

export default SideBar;