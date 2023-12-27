import style from './ReviewBoard.module.css';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const ReviewBoardTest = () => {
    return (
        <>
            <div className={style.boardTitle}>**중개사 리뷰</div>
            <hr></hr>
            <div /*className={roomStyle.triangle}*/></div>
            <div /*className={roomStyle.searchDiv}*/>
                <div className={style.searchBox}>
                    <div className={style.searchInput}>
                        <div><FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /></div>
                        <div>
                            <input placeholder="검색어" /*onChange={handleSearchChange} value={searchText}*/ />
                        </div>
                    </div>
                    <div>
                        <button /*onClick={() => { search() }}*/>Search</button>
                    </div>
                </div>
            </div>
            <hr />
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>날짜</div>
                    <div>조회수</div>
                </div>
                {/* <div className={style.boardListContents}>
                    {contentslist()}
                </div> */}
            </div>

        </>
    );
}

export default ReviewBoardTest;