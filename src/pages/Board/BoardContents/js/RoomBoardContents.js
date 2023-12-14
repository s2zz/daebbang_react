import style from '../css/BoardContents.module.css';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";

const RoomBoardContents = () => {

    const location = useLocation();
    const navi = useNavigate();
    const [boardContents, setBoardContents] = useState({});
    const [replyList, setReplyList] = useState([{}]);
    const [fileList, setFileList] = useState([{}]);

    // 댓글 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 게시글 내용, 댓글 목록 불러오기
    useEffect(() => {
        axios.get(`/api/board/boardContents/${location.state.sysSeq}`).then(resp => {
            setBoardContents(resp.data);
            setReplyList(resp.data.replies.sort(compareBySeq));
            setFileList(resp.data.files.sort(compareBySeq));
        }).catch(err => {
            console.log(err);
        })
    }, [replyList.length])

    // 댓글 추가
    const [insertReply, setInsertReply] = useState({ contents: "", parentSeq: location.state.sysSeq });
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

    // 댓글 수정
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

    // 댓글 삭제
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

    // 게시글 삭제
    const contentsDel = (seq) => {
        let imgList = existImgSearch(boardContents.contents);
        if(window.confirm("게시글을 삭제하시겠습니까?")){
            axios.delete(`/api/board/${seq}`,{ data: imgList }).then(resp=>{
                alert("게시글 삭제에 성공하였습니다");
                navi("/board/toRoomBoardList");
            }).catch(err=>{
                alert("게시글 삭제에 실패하였습니다");
                console.log(err);
            })
        }
    }

    // 게시글 내용에 존재하는 태그 뽑아내기 ( sysName )
    const existImgSearch = (contents) => { 
        const imgSrcRegex = /<img[^>]*src=["']\/uploads\/board\/([^"']+)["'][^>]*>/g;
        let existImgList = [];
        let match;
        while ((match = imgSrcRegex.exec(contents)) !== null) {
            existImgList.push(match[1]);
        }
        return existImgList;
    }

    // 댓글 페이지네이션
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

     // 파일 다운로드
     const downloadFile = (sysName,oriName) => {
        axios.get("/api/file",{params:{sysName:sysName,oriName:oriName}}).then(resp=>{
        }).catch(err=>{
            alert("파일 다운로드 중 에러가 발생하였습니다");
            console.log(err);
        })
    }

    return (
        <>
            <div className={style.boardContentsTitle}>
                <span>[{boardContents.header}]</span>
                {boardContents.title}
            </div>
            <div className={style.boardContentsInfo}>
                <div>
                    작성자 {boardContents.writer} | 날짜 {boardContents.writeDate ? boardContents.writeDate.split("T")[0] : ""}
                </div>
                <div>
                    <button onClick={()=>{contentsDel(location.state.sysSeq)}}>삭제</button>
                </div>
            </div>
            <div>
                {
                    fileList.map((e,i)=>{
                        return (
                            <div key={i} onClick={()=>downloadFile(e.sysName,e.oriName)}>{e.oriName}</div>
                        );
                    })
                }
            </div>
            <div className={style.boardContentsDiv} dangerouslySetInnerHTML={{ __html: boardContents.contents }}>
            </div>
            <div>
                <Link to="/board/toRoomBoardList" state={{searchText:location.state!==null && location.state.searchText!=null ? location.state.searchText : ""}}><button>뒤로가기</button></Link>
                <Link to="/board/toEditRoomBoardContents" state={{sysSeq:location.state.sysSeq}}><button>수정하기</button></Link>
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