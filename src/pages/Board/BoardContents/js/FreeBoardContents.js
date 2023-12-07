import style from '../css/BoardContents.module.css';
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const FreeBoardContents = () => {
    const location = useLocation();
    const [boardContents, setBoardContents] = useState({ contents: "" });
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
            setInsertReply(prev=>({...prev,contents:""}));
            setReplyList(resp.data.sort(compareBySeq));
        }).catch(err => {
            alert("댓글 등록 실패");
            console.log(err);
        })
    }
  
    const [visibleUpdateBox, setVisibleUpdateBox] = useState(false);

    const showUpdateBox = () => {
        visibleUpdateBox ? setVisibleUpdateBox(false) : setVisibleUpdateBox(true);
    }


    return (
        <>
            <div className={style.boardContentsTitle}>{boardContents.title}</div>
            <div className={style.boardContentsInfo}>
                <div>
                    글 번호 {location.state.sysSeq} | 작성자 {boardContents.writer} | 날짜 {boardContents.writeDate ? boardContents.writeDate.split("T")[0] : ""}
                </div>
                <div>
                    <button>삭제</button>
                </div>
            </div>
            <div className={style.boardContentsDiv} dangerouslySetInnerHTML={{ __html: boardContents.contents }}></div>
            <div>
                <Link to="/board/toFreeBoardList"><button>뒤로가기</button></Link>
                <button>수정하기</button>
            </div>
            <hr />
            <div>
                <div className={style.insertReplyDiv}>
                    <div>
                        <textarea placeholder="댓글을 입력해주세요" onChange={insertReplyHandleChange} value={insertReply.contents}/>
                    </div>
                </div>
                <div>
                    <button onClick={insertReplyAdd}>등록</button>
                </div>
            </div>
            <hr />
            {
                replyList.map((e, i) => {
                    if (i === 0) {
                        return (
                            <div className={style.replyBoxFirst} key={i}>
                                <div className={style.replyInfo}>
                                    <div>{e.writer}</div>
                                    <div>{e.writeDate ? e.writeDate.split("T")[0] : ""}</div>
                                </div>
                                {
                                    visibleUpdateBox ? <div><textarea>{e.contents}</textarea></div> : <div>{e.contents}</div>
                                }
                                <div>
                                    <button onClick={showUpdateBox}>수정</button>
                                    <button>삭제</button>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className={style.replyBox} key={i}>
                                <div className={style.replyInfo}>
                                    <div>{e.writer}</div>
                                    <div>{e.writeDate ? e.writeDate.split("T")[0] : ""}</div>
                                </div>
                                <div>
                                    {e.contents}
                                </div>
                                <div>
                                    <button onClick={showUpdateBox}>수정</button>
                                    <button>삭제</button>
                                </div>
                            </div>
                        );
                    }
                })
            }
            <div className={style.naviFooter}>
                &lt; 1 2 3 4 5 6 7 8 9  10 &gt;
            </div>
        </>
    )
}

export default FreeBoardContents;