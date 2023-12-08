import { Link } from "react-router-dom";
import style from "../css/BoardList.module.css";
import roomStyle from "../css/RoomBoardList.module.css";
import favorite from "../../assets/favorites.png";
import { useState, useEffect } from "react";
import axios from "axios";

const RoomBoardList = () => {

    const [board, setBoard] = useState([]);

    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }
    
    useEffect(() => {
        console.log("d")
        axios.get(`/api/board/roomBoardList`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
        })
    }, [])

    return (
        <>
            <div className={style.boardTitle}>양도게시판</div>
            <hr></hr>
            <div className={roomStyle.searchDiv}>
                <div className={style.selectBox}>
                    <select>
                        <option selected>전체게시물</option>
                        <option>양도합니다</option>
                        <option>양도구합니다</option>
                    </select>
                </div>
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
                                        <Link to={`/board/toFreeBoardContents/${board.length-i}`} style={{ textDecoration: "none" }} state={{oriSeq:e.seq,sysSeq:board.length-(i)}}>
                                            <span>[{e.header}]</span>
                                            {e.title}
                                        </Link>
                                    </div>
                                    <div>{e.writeDate.split("T")[0]}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={style.writeBtnDiv}>
                <Link to="/board/toRoomBoardWrite"><button>글 작성</button></Link>
            </div>
            <div className={style.naviFooter}>
                &lt; 1 2 3 4 5 6 7 8 9  10 &gt;
            </div>
        </>
    );
}

export default RoomBoardList;