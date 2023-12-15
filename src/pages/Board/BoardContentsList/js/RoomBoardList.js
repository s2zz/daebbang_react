import { Link, useLocation } from "react-router-dom";
import style from "../css/BoardList.module.css";
import roomStyle from "../css/RoomBoardList.module.css";
import favorite from "../../assets/favorites.png";
import notFavorite from "../../assets/notFavorite.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

const RoomBoardList = () => {
    const location = useLocation();
    const [board, setBoard] = useState([]);
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [category, setCategory] = useState("전체게시물");
    const [categoryBoard, setCategoryBoard] = useState([]); // 카테고리 ( 양도합니다 / 양도 구합니다 )
    const [searchText, setSearchText] = useState(location.state !== null && location.state.searchText !== null ? location.state.searchText : "");
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    useEffect(() => {
        axios.get(`/api/board/roomBoardList`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
            if (searchText !== "") {
                setSearchBoard(resp.data.sort(compareBySeq).filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
            }
        })
    }, [])

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

    // 즐겨찾기 추가
    const addFav = (parentSeq) => {
        if (window.confirm("즐겨찾기를 추가하시겠습니까?")) {
            let fav = { boardTitle: "양도게시판", parentSeq: parentSeq };
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

    const [completeSearchText, setCompleteSearchText] = useState("");

    // 검색 기능
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
            setSearchBoard(board.filter(e => e.contents.includes(searchText) || e.title.includes(searchText) || e.header.includes(searchText)));
    }

    // 카테고리 선택 ( 양도합니다 / 양도 구합니다 )
    const categoryChange = (e) => {
        let category = e.target.value;
        setCategory(category);
        setSearchBoard([]);
        setSearchText("");
        setCompleteSearchText("");
        if (category === "전체게시물") {
            setCategoryBoard([]);
        } else if (category === "양도합니다") {
            setCategoryBoard(board.filter(e => e.header === "양도합니다"));
        } else if (category === "양도구합니다") {
            setCategoryBoard(board.filter(e => e.header === "양도 구합니다"));
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

    const contentslist = () => {
        if (completeSearchText !== "") {
            return sliceContentsList(searchBoard).map(boardItem);
        } else if (category !== "전체게시물") {
            return sliceContentsList(categoryBoard).map(boardItem);
        } else {
            return sliceContentsList(board).map(boardItem);
        }
    }

    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div>{e.favorite === 'true' ? <img src={favorite} onClick={() => { delFav(e.seq) }} alt="..." /> : <img src={notFavorite} onClick={() => { addFav(e.seq) }} alt="..."/>}</div>
                <div>{board.length - (countPerPage * (currentPage - 1)) - i}</div>
                <div>{e.writer}</div>
                <div>
                    <Link to={`/board/toRoomBoardContents`} style={{ textDecoration: "none" }} state={{ sysSeq: e.seq, searchText: completeSearchText }}>
                        <span>[{e.header}]</span>
                        {e.title.length > 80 ? e.title.substring(0, 80) + "..." : e.title}
                    </Link>
                </div>
                <div>{e.writeDate.split("T")[0]}</div>
            </div>
        );
    }
    return (
        <>
            <div className={style.boardTitle}>양도게시판</div>
            <hr></hr>
            <div className={roomStyle.searchDiv}>
                <div className={style.selectBox}>
                    <select onChange={categoryChange}>
                        {["전체게시물", "양도합니다", "양도구합니다"].map((e, i) => {
                            return (
                                category === e ? <option value={e} key={i} selected>{e}</option> : <option value={e} key={i}>{e}</option>
                            )
                        })}
                    </select>
                </div>
                <div className={style.searchBox}>
                    <div>icon</div>
                    <div>
                        <input placeholder="검색어" onChange={handleSearchChange} value={searchText} />
                    </div>
                    <div>
                        <button onClick={() => { search() }}>Search</button>
                    </div>
                </div>
            </div>
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div><img src={notFavorite} alt="..."/></div>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>날짜</div>
                </div>
                <div className={style.boardListContents}>
                    {contentslist()}
                </div>
            </div>
            <div className={style.writeBtnDiv}>
                <Link to="/board/toRoomBoardWrite"><button>글 작성</button></Link>
            </div>
            <div className={style.naviFooter}>
                {pagenation()}
            </div>
        </>
    );
}

export default RoomBoardList;