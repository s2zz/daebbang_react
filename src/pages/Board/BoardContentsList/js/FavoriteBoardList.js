import style from "../css/BoardList.module.css";
import favorite from "../../assets/favorites.png";
import fstyle from "../css/FavoriteBoardList.module.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const FavoriteBoardList = () => {
    const [board, setBoard] = useState([]);
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [searchText, setSearchText] = useState("");
    const [category, setCategory] = useState("전체게시물");
    const [categoryBoard, setCategoryBoard] = useState([]);
    // 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 게시글 목록 불러오기
    useEffect(() => {
        axios.get(`/api/board/favBoardList`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
        })
    }, []);

    // 페이지네이션
    const [currentPage, setCurrentPage] = useState(1);
    const countPerPage = 10;
    const sliceContentsList = (list) => {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        return list.slice(start, end);
    }

    const currentPageHandle = (event, currentPage) => {
        setCurrentPage(currentPage);
    }

    // 즐겨찾기 제거
    const delFav = (parentSeq) => {
        if (window.confirm("즐겨찾기를 삭제하시겠습니까?")) {
            axios.delete(`/api/favoriteBoard/${parentSeq}`).then(resp => {
                setBoard(board.filter(e => e.seq !== parentSeq));
                alert("즐겨찾기 삭제에 성공하였습니다");
            }).catch(err => {
                alert("즐겨찾기 삭제에 실패하였습니다");
                console.log(err);
            })
        }
    }

    const [completeSearchText, setCompleteSearchText] = useState("");

    // 검색
    const handleSearchChange = (e) => {
        setCompleteSearchText("");
        setSearchText(e.target.value);
    }

    const search = () => {
        setCompleteSearchText(searchText);
        setCategoryBoard([]);
        setCurrentPage(1);
        setCategory("전체게시물");
        searchText === "" ?
            setSearchBoard([]) :
            setSearchBoard(board.filter(e => e.contents.includes(searchText) || e.title.includes(searchText) || (e.header !== null && e.header.includes(searchText))));
    }

    const categoryChange = (e) => {
        let category = e.target.value;
        setCategory(category);
        setSearchBoard([]);
        setSearchText("");
        setCompleteSearchText("");
        if (category === "전체게시물") {
            setCategoryBoard([]);
        } else if (category === "자유게시판") {
            setCategoryBoard(board.filter(e => e.boardTitle === "자유게시판"));
        } else if (category === "양도게시판") {
            setCategoryBoard(board.filter(e => e.boardTitle === "양도게시판"));
        }
    }

    const pagenation = () => {
        if (completeSearchText !== "") {
            return <Pagination count={Math.ceil(searchBoard.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />;
        } else if (category !== "전체게시물") {
            return <Pagination count={Math.ceil(categoryBoard.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />;
        } else {
            return <Pagination count={Math.ceil(board.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />;
        }
    }


    const noBoardContents = () => {
        return (
            <div className={style.noBoardContents}>
                게시글이 없습니다.
            </div>
        );
    }

    const contentslist = () => {
        if (completeSearchText !== "") {
            return searchBoard.length === 0 ? noBoardContents() : sliceContentsList(searchBoard).map(boardItem);
        } else if (category !== "전체게시물") {
            return categoryBoard.length === 0 ? noBoardContents() : sliceContentsList(categoryBoard).map(boardItem);
        } else {
            return board.length === 0 ? noBoardContents() : sliceContentsList(board).map(boardItem);
        }
    }

    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div><img src={favorite} onClick={() => { delFav(e.seq) }} alt="..." /></div>
                <div>{board.length - (countPerPage * (currentPage - 1)) - i}</div>
                <div>{e.writer}</div>
                <div>
                    <Link to={`/board/toFreeBoardContents`} style={{ textDecoration: "none" }} state={{ sysSeq: e.seq }}>
                        {e.header === null ? "" : <span>[{e.header}]</span>}
                        {e.title.length > 80 ? e.title.substring(0, 80) + "..." : e.title}
                    </Link>
                </div>
                <div>{e.boardTitle}</div>
                <div>{e.writeDate.split("T")[0]}</div>
            </div>
        );
    }

    return (
        <>
            <div className={style.boardTitle}>게시판</div>
            <hr></hr>
            <div className={style.selectBoard}>
                <div>즐겨찾기</div>
                <Link to="/board/toFreeBoardList"><div>자유게시판</div></Link>
                <Link to="/board/toRoomBoardList"><div>양도게시판</div></Link>
            </div>
            <div className={fstyle.triangle}></div>
            <div className={fstyle.searchDiv}>
                <div className={style.selectBox}>
                    <select onChange={categoryChange}>
                        {["전체게시물", "자유게시판", "양도게시판"].map((e, i) => {
                            return (
                                category === e ? <option value={e} key={i} selected>{e}</option> : <option value={e} key={i}>{e}</option>
                            )
                        })}
                    </select>
                </div>
                <div className={style.searchBox}>
                    <div className={style.searchInput}>
                        <div><FontAwesomeIcon icon={faMagnifyingGlass} size="xl" /></div>
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
                <div className={fstyle.boardInfo}>
                    <div><img src={favorite} alt="..." /></div>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>게시판</div>
                    <div>날짜</div>
                </div>
                <div className={fstyle.boardListContents}>
                    {contentslist()}
                </div>
            </div>
            <div className={style.naviFooter}>
                {pagenation()}
            </div>

        </>
    );
}

export default FavoriteBoardList;