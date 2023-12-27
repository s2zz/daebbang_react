import style from './ReviewBoard.module.css';
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from "react";
import axios from "axios";

const ReviewBoardTest = () => {
    const location = useLocation();
    const [board, setBoard] = useState([]); // 검색어 없을 때
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [searchText, setSearchText] = useState(location.state !== null && location.state.searchText !== null ? location.state.searchText : "");

    // 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 리뷰 목록 불러오기
    useEffect(() => {
        let realEstateNumber="44131-2017-03786"
        axios.get(`/api/review/reviewByAgent/${realEstateNumber}`).then(resp => {
            setBoard(resp.data.sort(compareBySeq));
            console.log(resp.data);
        }).catch(err=>{
            console.log(err);
        })
        
    }, []);

    // 게시글 내용 리턴
    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div>{e.estateId}</div>
                <div>{e.anonymous ? "익명" : e.id}</div>
                <div>{e.estate ? e.estate.title : ""}</div>
                <div>{e.writeDate.split("T")[0]}</div>
            </div>
        );
    }

    return (
        <>
            <div className={style.boardTitle}>{board[0] ? board[0].estate.realEstateAgent.estateName : ""}의 매물 리뷰</div>
            <hr></hr>
            <div className={style.searchDiv}>
                <div className={style.searchBox}>
                    <div className={style.searchInput}>
                        <div><FontAwesomeIcon icon={faMagnifyingGlass} size="xl" style={{ color: "#535353" }} /></div>
                        <div>
                            <input placeholder="검색어" /*onChange={handleSearchChange} value={searchText}*/ />
                        </div>
                    </div>
                    <div>
                        <button /*onClick={() => { search() }}*/>Search</button>
                    </div>
                </div>
            </div>
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div>매물번호</div>
                    <div>작성자</div>
                    <div>매물</div>
                    <div>날짜</div>
                </div>
                { <div className={style.boardListContents}>
                    {board.map(boardItem)}
                </div> }
            </div>

        </>
    );
}

export default ReviewBoardTest;