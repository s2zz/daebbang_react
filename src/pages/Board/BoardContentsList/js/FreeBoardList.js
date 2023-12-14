import { Link, useLocation } from "react-router-dom";
import style from "../css/BoardList.module.css";
import freeStyle from "../css/FreeBoardList.module.css";
import favorite from "../../assets/favorites.png";
import notFavorite from "../../assets/notFavorite.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

const FreeBoardList = () => {
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
        axios.get(`/api/board/freeBoardList`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
            if(searchText!==""){
                setSearchBoard(resp.data.sort(compareBySeq).filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
            }
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

    // 즐겨찾기 추가
    const addFav = (parentSeq) => {
        if (window.confirm("즐겨찾기를 추가하시겠습니까?")) {
            let fav = { boardTitle: "자유게시판", parentSeq: parentSeq };
            axios.post("/api/favoriteBoard", fav).then(resp => {
                setBoard(board.map((e, i) => {
                    if (e.seq === parentSeq) { e.favorite = 'true' }
                    return e;
                }))
                alert("즐겨찾기 등록에 성공하였습니다");
            }).catch(err => {
                alert("즐겨찾기 등록에 실패하였습니다");
                console.log(err);
            })
        }
    }

    // 즐겨찾기 제거
    const delFav = (parentSeq) => {
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            axios.delete(`/api/favoriteBoard/${parentSeq}`).then(resp => {
                setBoard(board.map((e, i) => {
                    if (e.seq === parentSeq) { e.favorite = 'false' }
                    return e;
                }))
                alert("즐겨찾기 삭제에 성공하였습니다");
            }).catch(err => {
                alert("즐겨찾기 삭제에 실패하였습니다");
                console.log(err);
            })
        }
    }

    // 검색 기능
    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
    }

    const search = () => {
        setCurrentPage(1);
        searchText === "" ?
            setSearchBoard([]) :
            setSearchBoard(board.filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
    }

    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div>{e.favorite === 'true' ? <img src={favorite} onClick={() => { delFav(e.seq) }} /> : <img src={notFavorite} onClick={() => { addFav(e.seq) }} />}</div>
                <div>{board.length - (countPerPage * (currentPage - 1)) - i}</div>
                <div>{e.writer}</div>
                <div>
                    <Link to={`/board/toFreeBoardContents`} style={{ textDecoration: "none" }} state={{ sysSeq: e.seq, searchText:searchText }}>
                        {e.title.length > 80 ? e.title.substring(0, 80) + "..." : e.title}
                    </Link>
                </div>
                <div>{e.writeDate.split("T")[0]}</div>
            </div>
        );
    }

    return (
        <>
            <div className={style.boardTitle}>자유게시판</div>
            <hr></hr>
            <div className={freeStyle.searchDiv}>
                <div className={style.searchBox}>
                    <div>icon</div>
                    <div>
                        <input placeholder="검색어" onChange={handleSearchChange}  value={searchText}/>
                    </div>
                    <div>
                        <button onClick={() => { search() }}>Search</button>
                    </div>
                </div>
            </div>
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div><img src={notFavorite} /></div>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>날짜</div>
                </div>
                <div className={style.boardListContents}>
                    {
                        searchBoard.length === 0?
                            sliceContentsList().map(boardItem) :
                            sliceSearchContentsList().map(boardItem)
                    }
                </div>
            </div>
            <div className={style.writeBtnDiv}>
                <Link to="/board/toFreeBoardWrite"><button>글 작성</button></Link>
            </div>
            <div className={style.naviFooter}>
                {
                    searchBoard.length === 0 ? 
                    <Pagination count={Math.ceil(board.length / countPerPage)} page={currentPage} onChange={currentPageHandle}/> :
                    <Pagination count={Math.ceil(searchBoard.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />
                }
            </div>

        </>
    );
}

export default FreeBoardList;