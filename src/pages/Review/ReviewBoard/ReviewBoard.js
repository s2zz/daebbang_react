import style from './ReviewBoard.module.css';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Pagination from "@mui/material/Pagination";
import axios from "axios";


const ReviewBoard = () => {
    const location = useLocation();
    const [board, setBoard] = useState([]); // 검색어 없을 때
    const [searchBoard, setSearchBoard] = useState([]); // 검색어 있을 때
    const [searchText, setSearchText] = useState(location.state !== null && location.state.searchText !== null ? location.state.searchText : "");
    const realEstateNumber = location.state !== null && location.state.realEstateNumber ? location.state.realEstateNumber : "";
    // 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 리뷰 목록 불러오기
    useEffect(() => {
        if (realEstateNumber !== "") {
            axios.get(`/api/review/reviewByAgent/${realEstateNumber}`).then(resp => {
                setBoard(resp.data.sort(compareBySeq));
                console.log(resp.data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [realEstateNumber]);

    // 게시글 내용 리턴
    const boardItem = (e, i) => {
        return (
            <div key={i}>
                <div>{e.estateId}</div>
                <div>{e.anonymous ? "익명" : e.id}</div>

                <div>
                    <Link to="/review/boardContentsReview" state={{ seq: e.seq }}>
                        {
                            e.estate
                                ? e.estate.title.length > 20 ? e.estate.title.substring(0, 20) + "..." : e.estate.title
                                : ""
                        }
                    </Link>
                </div>

                <div>{e.estate ? e.estate.address2 : ""}</div>
                <div>{e.writeDate.split("T")[0]}</div>
            </div>
        );
    }

    //페이지네이션
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
            setSearchBoard(board.filter( e => e.estateId.toString().includes(searchText) || e.estate.address2.includes(searchText)));
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

    return (
        <>
            <div className={style.boardTitle}>{board[0] ? board[0].estate.realEstateAgent.estateName : ""}의 매물 리뷰</div>
            <hr></hr>
            <div className={style.searchDiv}>
                <div className={style.searchBox}>
                    <div className={style.searchInput}>
                        <div><FontAwesomeIcon icon={faMagnifyingGlass} size="xl" style={{ color: "#535353" }} /></div>
                        <div>
                            <input placeholder="매물 번호 또는 지역" onChange={e=>handleSearchChange(e)} value={searchText} />
                        </div>
                    </div>
                    <div>
                        <button onClick={() => { search() }}>Search</button>
                    </div>
                </div>
            </div>
            <div className={style.boardContentsBox}>
                <div className={style.boardInfo}>
                    <div>매물 번호</div>
                    <div>작성자</div>
                    <div>매물 설명</div>
                    <div>지역</div>
                    <div>날짜</div>
                </div>
                {<div className={style.boardListContents}>
                    {contentslist()}
                </div>}
            </div>
            <div className={style.naviFooter}>
                {
                    searchBoard.length === 0 ?
                        <Pagination count={Math.ceil(board.length / countPerPage)} page={currentPage} onChange={currentPageHandle} /> :
                        <Pagination count={Math.ceil(searchBoard.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />
                }
            </div>
        </>
    );
}

export default ReviewBoard;