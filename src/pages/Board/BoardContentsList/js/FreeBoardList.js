import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "../css/BoardList.module.css";
import freeStyle from "../css/FreeBoardList.module.css";
import favorite from "../../assets/favorites.png";
import notFavorite from "../../assets/notFavorite.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../../commons/Loading';


const FreeBoardList = ({ loginId }) => {
    const [loading, setLoading] = React.useState(true);
    const navi = useNavigate();
    const location = useLocation();
    const [board, setBoard] = useState([]); // 검색어 없을 때
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [searchText, setSearchText] = useState(location.state !== null && location.state.searchText !== null ? location.state.searchText : "");
    // 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 게시글 목록 불러오기
    useEffect(() => {
        axios.get(`/api/board/freeBoardList/${loginId}`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
            if (searchText !== "") {
                setSearchBoard(resp.data.sort(compareBySeq).filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
            }
            setLoading(false);
        })
    }, []);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const countPerPage = 10;
    const sliceContentsList = () => {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        return board.slice(start, end);
    }
    const sliceSearchContentsList = () => {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        return searchBoard.slice(start, end);
    }
    const currentPageHandle = (event, currentPage) => {
        setCurrentPage(currentPage);
    }

    const moveWrite = (loginId) => {
        if (loginId === null) {
            alert("로그인 후 이용가능한 서비스입니다.");
            navi("/login");
        } else {
            navi("/board/toFreeBoardWrite");
        }
        return;
    }

    // 즐겨찾기 추가
    const addFav = (parentSeq) => {

        if (loginId === null) {
            alert("로그인 후 이용가능한 서비스입니다");
            return;
        }

        let fav = { boardTitle: "자유게시판", parentSeq: parentSeq };
        axios.post("/api/favoriteBoard", fav).then(resp => {
            setBoard(board.map((e, i) => {
                if (e.seq === parentSeq) { e.favorite = 'true' }
                return e;
            }))
        }).catch(err => {
            alert("즐겨찾기 추가에 실패하였습니다.");
            console.log(err);
        })
    }

    // 즐겨찾기 제거
    const delFav = (parentSeq) => {

        if (loginId === null) {
            alert("로그인 후 이용가능한 서비스입니다");
            return;
        }

        axios.delete(`/api/favoriteBoard/${parentSeq}`).then(resp => {
            setBoard(board.map((e, i) => {
                if (e.seq === parentSeq) { e.favorite = 'false' }
                return e;
            }))
        }).catch(err => {
            alert("즐겨찾기 해제에 실패하였습니다.");
            console.log(err);
        })

    }

    // 검색 기능
    const [completeSearchText, setCompleteSearchText] = useState("");
    const handleSearchChange = (e) => {
        setCompleteSearchText("");
        setSearchText(e.target.value);
    }

    const search = () => {
        setCurrentPage(1);
        setCompleteSearchText(searchText);
        searchText === "" ?
            setSearchBoard([]) :
            setSearchBoard(board.filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
    }

    const noBoardContents = () => {
        return (
            <div className={style.noBoardContents}>
                게시글이 없습니다.
            </div>
        );
    }

    const contentslist = () => {
        if (completeSearchText === "" && searchBoard.length === 0) {
            return board.length === 0 ? noBoardContents() : sliceContentsList().map(boardItem);
        } else {
            return searchBoard.length === 0 ? noBoardContents() : sliceSearchContentsList().map(boardItem);
        }
    }

    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div>{e.favorite === 'true' ? <img src={favorite} onClick={() => { delFav(e.seq) }} alt="..." className={style.fav} /> : <img src={notFavorite} onClick={() => { addFav(e.seq) }} alt="..." className={style.notFav} />}</div>
                <div>{board.length - (countPerPage * (currentPage - 1)) - i}</div>
                <div>{e.writer}</div>
                <div>
                    <Link to={`/board/toFreeBoardContents`} style={{ textDecoration: "none" }} state={{ sysSeq: e.seq, searchText: searchText }}>
                        {e.title.length > 20 ? e.title.substring(0, 20) + "..." : e.title}
                    </Link>
                </div>
                <div>{e.writeDate.split("T")[0]}</div>
                <div>{e.viewCount}</div>
            </div>
        );
    }

    return (
        <>
            {loading ? <Loading></Loading> :
                <>
                    <div className={style.boardTitle}>게시판</div>
                    <hr></hr>
                    <div className={style.selectBoard}>
                        <Link to="/board/toFavoriteBoardList"><div>즐겨찾기</div></Link>
                        <div>자유게시판</div>
                        <Link to="/board/toRoomBoardList"><div>양도게시판</div></Link>
                    </div>
                    <div className={freeStyle.triangle}></div>
                    <div className={freeStyle.searchDiv}>
                        <div className={style.searchBox}>
                            <div className={style.searchInput}>
                                <div><FontAwesomeIcon icon={faMagnifyingGlass} size="xl" style={{ color: "#535353" }} /></div>
                                <div>
                                    <input placeholder="검색어" onChange={handleSearchChange} value={searchText} />
                                </div>
                            </div>
                            <div>
                                <button onClick={() => { search() }}>Search</button>
                            </div>
                        </div>
                    </div>
                    <div className={style.boardContentsBox}>
                        <div className={style.boardInfo}>
                            <div><img src={favorite} alt="..." className={style.fav} /></div>
                            <div>번호</div>
                            <div>작성자</div>
                            <div>제목</div>
                            <div>날짜</div>
                            <div>조회수</div>
                        </div>
                        <div className={style.boardListContents}>
                            {contentslist()}
                        </div>
                    </div>
                    <div className={style.writeBtnDiv}>
                        <button onClick={() => { moveWrite(loginId) }}>글 작성</button>
                    </div>
                    <div className={style.naviFooter}>
                        {
                            searchBoard.length === 0 ?
                                <Pagination count={Math.ceil(board.length / countPerPage)} page={currentPage} onChange={currentPageHandle} /> :
                                <Pagination count={Math.ceil(searchBoard.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />
                        }
                    </div>
                </>
            }
        </>


    );
}

export default FreeBoardList;