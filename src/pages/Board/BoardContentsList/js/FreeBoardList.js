import { Link } from "react-router-dom";
import style from "../css/BoardList.module.css";
import freeStyle from "../css/FreeBoardList.module.css";
import favorite from "../../assets/favorites.png";
import { useState, useEffect } from "react";
import axios from "axios";

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
                    <div><img src={favorite} /></div>
                    <div>번호</div>
                    <div>작성자</div>
                    <div>제목</div>
                    <div>날짜</div>
                </div>
                <div className={style.boardListContents}>
                    {
                        board.map((e, i) => {
                            return (
                                <div key={i} data-seq={e.seq}>
                                    <div><img src={favorite} /></div>
                                    <div>{board.length-(i)}</div>
                                    <div>{e.writer}</div>
                                    <div>
                                        <Link to={`/board/toFreeBoardContents/${i+1}`} style={{ textDecoration: "none" }} state={{oriSeq:e.seq,sysSeq:i+1}}>{e.title}</Link>
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
                &lt; 1 2 3 4 5 6 7 8 9  10 &gt;
            </div>

        </>
    );
}

export default FreeBoardList;