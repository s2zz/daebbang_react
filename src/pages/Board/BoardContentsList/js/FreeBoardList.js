import { Link } from "react-router-dom";
import style from "../css/BoardList.module.css";
import freeStyle from "../css/FreeBoardList.module.css";
import favorite from "../../assets/favorites.png";
import notFavorite from "../../assets/notFavorite.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

const FreeBoardList = () => {
    const [board, setBoard] = useState([]);

    // 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    useEffect(() => {
        axios.get(`/api/board/freeBoardList`).then(resp => {
            console.log(resp.data.sort(compareBySeq))
            setBoard(resp.data.sort(compareBySeq));
        })
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const countPerPage = 10;
    const sliceContentsList = () => {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        return board.slice(start, end);
    }
    const currentPageHandle = (event, currentPage) => {
        setCurrentPage(currentPage);
    }

    return (
        <>
            <div className={style.boardTitle}>자유게시판</div>
            <hr></hr>
            <div className={freeStyle.searchDiv}>
                <div className={style.searchBox}>
                    <div>icon</div>
                    <div>
                        <input placeholder="검색어" />
                    </div>
                    <div>
                        <button>Search</button>
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
                        sliceContentsList().map((e, i) => {
                            return (
                                <div key={i} data-seq={e.seq}>
                                    <div><img src={notFavorite} /></div>
                                    <div>{board.length-(countPerPage*(currentPage-1))-i}</div>
                                    <div>{e.writer}</div>
                                    <div>
                                        <Link to={`/board/toFreeBoardContents/${(countPerPage*(currentPage-1))-i}`} style={{ textDecoration: "none" }} state={{oriSeq:e.seq,sysSeq:board.length-(i)}}>{e.title}</Link>
                                    </div>
                                    <div>{e.writeDate.split("T")[0]}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={style.writeBtnDiv}>
                <Link to="/board/toFreeBoardWrite"><button>글 작성</button></Link>
            </div>
            <div className={style.naviFooter}>
            <Pagination
                    count={Math.ceil(board.length / countPerPage)}
                    page={currentPage}
                    onChange={currentPageHandle} />
            </div>

        </>
    );
}

export default FreeBoardList;