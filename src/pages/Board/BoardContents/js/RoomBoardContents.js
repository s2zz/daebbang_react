import style from '../css/BoardContents.module.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const RoomBoardContents = () => {

    const location = useLocation();
    const [boardContents, setBoardContents] = useState({});
    const [replyList, setReplyList] = useState([{}]);

    // 댓글 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    useEffect(() => {
        axios.get(`/api/board/boardContents/${location.state.oriSeq}`).then(resp => {
            setBoardContents(resp.data);
            setReplyList(resp.data.replies.sort(compareBySeq));
        }).catch(err => {
            console.log(err);
        })
    }, [])

    const [insertReply, setInsertReply] = useState({ contents: "", parentSeq: location.state.oriSeq });
    const insertReplyHandleChange = (e) => {
        setInsertReply(prev => ({ ...prev, contents: e.target.value }));
    }

    const insertReplyAdd = () => {
        axios.post("/api/reply", insertReply).then(resp => {
            alert("댓글 등록 성공");
            setInsertReply(prev => ({ ...prev, contents: "" }));
            setReplyList(resp.data.sort(compareBySeq));
        }).catch(err => {
            alert("댓글 등록 실패");
            console.log(err);
        })
    }

    const [visibleUpdateBox, setVisibleUpdateBox] = useState(0);
    const [updateReply, setUpdateReply] = useState({ seq: 0, contents: "" });
    const showUpdateBox = (seq, contents) => {
        if (visibleUpdateBox !== 0) {
            let check = window.confirm("댓글 수정을 취소하고 다른 댓글을 수정하시겠습니까?");
            if (check) {
                setVisibleUpdateBox(seq);
                setUpdateReply({ seq: seq, contents: contents });
            }
        } else {
            setVisibleUpdateBox(seq);
            setUpdateReply({ seq: seq, contents: contents });
        }
    }
    const hideUpdateBox = (seq) => {
        if (visibleUpdateBox !== 0) {
            let check = window.confirm("댓글 수정을 취소하시겠습니까?");
            if (check) { setVisibleUpdateBox(0) }
            setUpdateReply(prev => ({ seq: 0, contents: "" }))
        }
    }
    const updateHandle = (e) => {
        console.log(e.target.value)
        setUpdateReply(prev => ({ ...prev, contents: e.target.value }))
    }

    const updateAdd = () => {
        axios.put("/api/reply", updateReply).then(resp => {
            alert("댓글 수정에 성공하였습니다");
            setReplyList(resp.data.sort(compareBySeq));
            setUpdateReply(prev => ({ seq: 0, contents: "" }));
            setVisibleUpdateBox(0);

        }).catch(err => {
            alert("댓글 수정에 실패하였습니다.");
            console.log(err);
        })
    }

    const delReplyBtn = (seq) => {
        if (window.confirm("댓글을 삭제하시겠습니까?")) {
            axios.delete(`/api/reply/${seq}`).then(resp => {
                alert("댓글 삭제에 성공하였습니다");
                setReplyList(replyList.filter(e => e.seq !== seq))
            }).catch(err => {
                alert("댓글 삭제에 실패아였습니다");
                console.log(err);
            })
        }
    }
    const [currentReplyPage, setCurrentReplyPage] = useState(1);
    const replyCountPerPage = 10;
    const sliceReplyList = () => {
        const start = (currentReplyPage - 1) * replyCountPerPage;
        const end = start + replyCountPerPage;
        return replyList.slice(start, end);
    }
    const replyCurrentPageHandle = (event, currentPage) => {
        setCurrentReplyPage(currentPage);
    }

    return (
        <>
            <div className={style.boardContentsTitle}>
                <span>[{boardContents.header}]</span>
                {boardContents.title}
            </div>
            <div className={style.boardContentsInfo}>
                <div>
                    글 번호 {location.state.sysSeq} | 작성자 {boardContents.writer} | 날짜 {boardContents.writeDate ? boardContents.writeDate.split("T")[0] : ""}
                </div>
                <div>
                    <button>삭제</button>
                </div>
            </div>
            <div className={style.boardContentsDiv} dangerouslySetInnerHTML={{ __html: boardContents.contents }}>
            </div>
            <div>
                <Link to="/board/toRoomBoardList"><button>뒤로가기</button></Link>
                <button>수정하기</button>
            </div>
            <hr />
            <div>
                <div className={style.insertReplyDiv}>
                    <div>
                        <textarea placeholder="댓글을 입력해주세요" onChange={insertReplyHandleChange} value={insertReply.contents} />
                    </div>
                </div>
                <div>
                    <button onClick={insertReplyAdd}>등록</button>
                </div>
            </div>
            <hr />
            {
                sliceReplyList().map((e, i) => {
                    if (i === 0) {
                        return (
                            <div className={style.replyBoxFirst} key={i}>
                                <div className={style.replyInfo}>
                                    <div>{e.writer}</div>
                                    <div>{e.writeDate ? e.writeDate.split("T")[0] : ""}</div>
                                </div>
                                {
                                    visibleUpdateBox === e.seq ? <div><textarea value={updateReply.contents} onChange={updateHandle}></textarea></div> : <div>{e.contents}</div>
                                }
                                {
                                    visibleUpdateBox === e.seq ?
                                        <div>
                                            <button onClick={() => hideUpdateBox(e.seq)}>취소</button>
                                            <button onClick={updateAdd}>수정완료</button>
                                        </div>
                                        :
                                        <div>
                                            <button onClick={() => showUpdateBox(e.seq, e.contents)}>수정</button>
                                            <button onClick={() => delReplyBtn(e.seq)}>삭제</button>
                                        </div>
                                }
                            </div>
                        );
                    } else {
                        return (
                            <div className={style.replyBox} key={i}>
                                <div className={style.replyInfo}>
                                    <div>{e.writer}</div>
                                    <div>{e.writeDate ? e.writeDate.split("T")[0] : ""}</div>
                                </div>
                                {
                                    visibleUpdateBox === e.seq ? <div><textarea value={updateReply.contents} onChange={updateHandle}></textarea></div> : <div>{e.contents}</div>
                                }
                                {
                                    visibleUpdateBox === e.seq ?
                                        <div>
                                            <button onClick={() => hideUpdateBox(e.seq)}>취소</button>
                                            <button>수정완료</button>
                                        </div>
                                        :
                                        <div>
                                            <button onClick={() => showUpdateBox(e.seq, e.contents)}>수정</button>
                                            <button onClick={() => delReplyBtn(e.seq)}>삭제</button>
                                        </div>
                                }

                            </div>
                        );
                    }
                })
            }
            <div className={style.naviFooter}>
                <Pagination
                    count={Math.ceil(replyList.length / replyCountPerPage)}
                    page={currentReplyPage}
                    onChange={replyCurrentPageHandle} />
            </div>
        </>
    )
}

export default RoomBoardContents;