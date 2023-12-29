import { Link, useLocation, useNavigate } from "react-router-dom";
import style from "../css/BoardList.module.css";
import roomStyle from "../css/RoomBoardList.module.css";
import favorite from "../../assets/favorites.png";
import notFavorite from "../../assets/notFavorite.png";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Loading from "../../../commons/Loading";


const RoomBoardList = ({ loginId }) => {
    const [loading, setLoading] = React.useState(true);
    const navi = useNavigate();
    const location = useLocation();
    const [board, setBoard] = useState([]);
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [category, setCategory] = useState("전체게시물");
    const [categoryBoard, setCategoryBoard] = useState([]); // 카테고리 ( 양도합니다 / 양도 구합니다 )
    const [searchText, setSearchText] = useState(location.state !== null && location.state.searchText !== null ? location.state.searchText : "");
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }
    const moveWrite = (loginId) => {
        if (loginId === null) {
            alert("로그인 후 이용가능한 서비스입니다");
            navi("/login")
        } else {
            navi("/board/toRoomBoardWrite");
        }
        return;
    }
    useEffect(() => {
        axios.get(`/api/board/roomBoardList`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
            if (searchText !== "") {
                setSearchBoard(resp.data.sort(compareBySeq).filter(e => e.contents.includes(searchText) || e.title.includes(searchText)));
            }
            setLoading(false);
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
        let fav = { boardTitle: "양도게시판", parentSeq: parentSeq };
        axios.post("/api/favoriteBoard", fav).then(resp => {
            setBoard(board.map((e, i) => {
                if (e.seq === parentSeq) { e.favorite = 'true' }
                return e;
            }))
        }).catch(err => {
            alert("즐겨찾기 등록에 실패하였습니다")
            console.log(err);
        })
    }

    // 즐겨찾기 제거
    const delFav = (parentSeq) => {

        axios.delete(`/api/favoriteBoard/${parentSeq}`).then(resp => {
            setBoard(board.map((e, i) => {
                if (e.seq === parentSeq) { e.favorite = 'false' }
                return e;
            }))
        }).catch(err => {
            alert("즐겨찾기 삭제에 실패하였습니다")
            console.log(err);
        })

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
                <div>{e.favorite === 'true' ? <img src={favorite} onClick={() => { delFav(e.seq) }} alt="..." className={style.fav} /> : <img src={notFavorite} onClick={() => { addFav(e.seq) }} alt="..." className={style.notFav} />}</div>
                <div>{board.length - (countPerPage * (currentPage - 1)) - i}</div>
                <div>{e.writer}</div>
                <div>
                    <Link to={`/board/toRoomBoardContents`} style={{ textDecoration: "none" }} state={{ sysSeq: e.seq, searchText: completeSearchText }}>
                        <span>[{e.header}]</span>
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
                        <Link to="/board/toFreeBoardList"><div>자유게시판</div></Link>
                        <div>양도게시판</div>
                    </div>
                    <div className={roomStyle.triangle}></div>
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
                        {pagenation()}
                    </div>
                </>
            }
        </>
    );
}

export default RoomBoardList;