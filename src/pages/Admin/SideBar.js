import { Link } from 'react-router-dom';
const SideBar = () => {
    return (
        <>
            <div>
                <Link to="">메인페이지</Link>
            </div>
            <div>
                <Link to="">회원 관리</Link>
            </div>
            <div>
                <Link to="">공인중개사 관리</Link>
            </div>
            <div>
                <Link to="">신고 관리</Link>
            </div>
        </>
    );
}
export default SideBar;