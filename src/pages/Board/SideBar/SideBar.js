import { Link } from 'react-router-dom';
const SideBar = () => {
    return (
        <>
            <div>
                <Link to="/board/toFavoriteBoardList">즐겨찾기</Link>
            </div>
            <div>
                <Link to="/board/toFreeBoardList">자유게시판</Link>
            </div>
            <div>
                <Link to="/board/toRoomBoardList">양도게시판</Link>
            </div>
        </>
    );
}

export default SideBar;