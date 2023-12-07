import { Link } from "react-router-dom";
import style from "../css/BoardList.module.css";
import favorite from "../../assets/favorites.png";
import { useState, useEffect } from "react";
import axios from "axios";

const RoomBoardList = () => {

    const [board, setBoard] = useState([]);

    useEffect(() => {
        axios.get(`/api/board/roomBoardList`).then(resp => {
            setBoard(resp.data);
            console.log(resp.data);
        })
    }, [])

    return (
        <>
            <div className={style.boardTitle}>양도게시판</div>
            <hr></hr>
            <div className={style.searchDiv}>
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
                                    <div>{i + 1}</div>
                                    <div>{e.writer}</div>
                                    <div>{e.title}</div>
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