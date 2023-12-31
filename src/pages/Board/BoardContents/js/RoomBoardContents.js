import style from '../css/BoardContents.module.css';
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import Loading from '../../../commons/Loading';

const RoomBoardContents = ({ loginId, admin }) => {
    const [loading, setLoading] = React.useState(true);
    const location = useLocation();
    const navi = useNavigate();
    const [boardContents, setBoardContents] = useState({});
    const [replyList, setReplyList] = useState([{}]);
    const [fileList, setFileList] = useState([{}]);

    const seq = location.state !== null && location.state.sysSeq !== null ? location.state.sysSeq : 0;

    // 댓글 내림차순 정렬
    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }

    // 게시글 내용, 댓글 목록 불러오기
    useEffect(() => {
        if (seq) {
            axios.get(`/api/board/boardContents/${seq}`).then(resp => {
                setBoardContents(resp.data);
                setReplyList(resp.data.replies.sort(compareBySeq));
                setFileList(resp.data.files.sort(compareBySeq));
                setLoading(false);
            })
        }
    }, [])

    // 댓글 추가
    const [insertReply, setInsertReply] = useState({ contents: "", parentSeq: seq });
    const insertReplyHandleChange = (e) => {
        setInsertReply(prev => ({ ...prev, contents: e.target.value }));
    }


    const insertReplyAdd = () => {
        if (loginId === null) {
            alert("로그인 후 이용가능한 서비스 입니다");
            navi("/login");
            return;
        }

        if (insertReply.contents === "") {
            alert("내용을 입력해주세요");
            return;
        }
        axios.post("/api/reply", insertReply).then(resp => {
            alert("댓글이 등록되었습니다.");
            setInsertReply(prev => ({ ...prev, contents: "" }));
            setReplyList(resp.data.sort(compareBySeq));
        }).catch(err => {
            alert("댓글 등록에 실패하였습니다.");
        })
    }

    // 댓글 수정
    const [visibleUpdateBox, setVisibleUpdateBox] = useState(0);
    const [updateReply, setUpdateReply] = useState({ seq: 0, contents: "" });
    const showUpdateBox = (seq, contents) => {
        if (visibleUpdateBox !== 0) {
            alert("수정을 완료하고 눌러주세요.");
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
        })
    }

    // 댓글 삭제
    const delReplyBtn = (seq) => {
        if (window.confirm("댓글을 정말 삭제하시겠습니까?")) {
            axios.delete(`/api/reply/${seq}`).then(resp => {
                alert("댓글이 삭제되었습니다");
                setReplyList(replyList.filter(e => e.seq !== seq))
            }).catch(err => {
                alert("댓글 삭제에 실패하였습니다");
            })
        }
    }

    // 게시글 삭제
    const contentsDel = (seq) => {
        let imgList = existImgSearch(boardContents.contents);

        if (window.confirm("게시글을 정말 삭제하시겠습니까?")) {
            axios.delete(`/api/board/${seq}`, { data: imgList }).then(resp => {
                alert("게시글이 삭제되었습니다");
                navi("/board/toRoomBoardList");
                return;
            }).catch(err => {
                alert("게시글 삭제에 실패하였습니다.");
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
    const downloadFile = (sysName, oriName) => {
        axios.get("/api/file", {
            params: { sysName: sysName, oriName: oriName },
            responseType: "blob"
        }).then(resp => {
            const url = window.URL.createObjectURL(new Blob([resp.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", oriName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => {
            alert("파일 다운로드 중 에러가 발생하였습니다");
        })
    }

    return (
        <>
            {loading ? <Loading></Loading> :
                <>
                    <div className={style.boardContentsTitle}>
                        <span style={{ whiteSpace: "nowrap" }}>[{boardContents.header}]</span>
                        {boardContents.title}
                    </div>
                    <div className={style.boardContentsInfo}>
                        <div>
                            작성자 {boardContents.writer} | 날짜 {boardContents.writeDate ? boardContents.writeDate.split("T")[0] : ""} | 조회수 {boardContents.viewCount}
                        </div>
                        <div>
                            {loginId === boardContents.writer || admin !== null ? <button onClick={() => { contentsDel(seq) }}>삭제</button> : ""}
                        </div>
                    </div>
                    <div className={style.fileBox}>
                        <div>첨부파일 목록</div>
                        {
                            fileList.length === 0 ?
                                <div>첨부파일이 존재하지 않습니다.</div> :
                                fileList.map((e, i) => {
                                    return (
                                        <div key={i} onClick={() => downloadFile(e.sysName, e.oriName)}>파일 {i + 1} | <span className={style.fileName}>{e.oriName}</span></div>
                                    );
                                })
                        }
                    </div>
                    <div className={style.boardContentsDiv} dangerouslySetInnerHTML={{ __html: boardContents.contents }}>
                    </div>
                    <div className={style.btns}>
                        <Link to="/board/toRoomBoardList" state={{ searchText: location.state !== null && location.state.searchText != null ? location.state.searchText : "" }}><button className={style.backBtn}>뒤로가기</button></Link>
                        {loginId === boardContents.writer || admin !== null ?
                            <Link to="/board/toEditRoomBoardContents" state={{ sysSeq: seq }}><button className={style.editBtn}>수정하기</button></Link> :
                            ""
                        }
                    </div>
                    <hr />
                    <div>
                        <span><FontAwesomeIcon icon={faCircleExclamation} /> &nbsp;</span>
                        양도 게시판을 통해 이루어지는 모든 거래 및 법적 절차는 거래 당사자 간의 독립적인 책임
                        아래 진행되며, DAEBBANG은 이에 대한 법적 책임을 부담하지 않습니다.
                    </div>
                    <hr />
                    <div>
                        <div className={style.insertReplyDiv}>
                            <div>
                                <textarea placeholder="댓글을 입력해주세요" onChange={insertReplyHandleChange} value={insertReply.contents} maxLength="300" />
                            </div>
                        </div>
                        <div className={style.insertReplyBtn}>
                            <button onClick={insertReplyAdd}>등록</button>
                        </div>
                    </div>
                    <hr className={style.replyListStartHr} />
                    {
                        sliceReplyList().length>0?
                        sliceReplyList().map((e, i) => {
                            if (i === 0) {
                                return (
                                    <div className={style.replyBoxFirst} key={i}>
                                        <div className={style.replyInfo}>
                                            <div>{e.writer}</div>
                                            <div>{e.writeDate ? e.writeDate.split("T")[0] : ""}</div>
                                        </div>
                                        {
                                            visibleUpdateBox === e.seq ? <div className={style.replyTextArea}><textarea value={updateReply.contents} onChange={updateHandle}></textarea></div> : <div>{e.contents}</div>
                                        }
                                        {
                                            visibleUpdateBox === e.seq ?
                                                <div className={style.replyListBtn}>
                                                    {loginId === e.writer || admin !== null ?
                                                        <><button onClick={() => hideUpdateBox(e.seq)} className={style.replyEditCancleBtn}>취소</button><button onClick={updateAdd} className={style.replycompleteEditBtn}>수정완료</button></> :
                                                        ""
                                                    }
                                                </div>
                                                :
                                                <div className={style.replyListBtn}>
                                                    {loginId === e.writer || admin !== null ?
                                                        <><button onClick={() => showUpdateBox(e.seq, e.contents)} className={style.replyEditBtn}>수정</button><button onClick={() => delReplyBtn(e.seq)} className={style.replyDelBtn}>삭제</button></> :
                                                        ""
                                                    }
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
                                            visibleUpdateBox === e.seq ? <div className={style.replyTextArea}><textarea value={updateReply.contents} onChange={updateHandle}></textarea></div> : <div>{e.contents}</div>
                                        }
                                        {
                                            visibleUpdateBox === e.seq ?
                                                <div className={style.replyListBtn}>
                                                    {loginId === e.writer || admin !== null ?
                                                        <><button onClick={() => hideUpdateBox(e.seq)} className={style.replyEditCancleBtn}>취소</button><button onClick={updateAdd} className={style.replycompleteEditBtn}>수정완료</button></> :
                                                        ""
                                                    }
                                                </div>
                                                :
                                                <div className={style.replyListBtn}>
                                                    {loginId === e.writer || admin !== null ?
                                                        <><button className={style.replyEditBtn} onClick={() => showUpdateBox(e.seq, e.contents)}>수정</button><button onClick={() => delReplyBtn(e.seq)} className={style.replyDelBtn}>삭제</button></> :
                                                        ""
                                                    }
                                                </div>
                                        }

                                    </div>
                                );
                            }
                        }) :
                        <div style={{textAlign:"center",marginTop:"20px"}}>등록된 댓글이 없습니다.</div>
                    }
                    <div className={style.naviFooter}>
                        <Pagination
                            count={Math.ceil(replyList.length / replyCountPerPage)}
                            page={currentReplyPage}
                            onChange={replyCurrentPageHandle} />
                    </div>
                </>}
        </>
    )
}

export default RoomBoardContents;