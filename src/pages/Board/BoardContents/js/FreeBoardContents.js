import style from '../css/BoardContents.module.css';
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Swal from 'sweetalert2'


const FreeBoardContents = ({ loginId, admin }) => {
    const location = useLocation();
    const navi = useNavigate();
    const [boardContents, setBoardContents] = useState({ contents: "" });
    const [replyList, setReplyList] = useState([{}]);
    const [fileList, setFileList] = useState([{}]);
    const alertDeleteSuccess = (str) => {
        Swal.fire({
            title: `${str} 삭제에 성공하였습니다`,
            text: "",
            icon: "success"
        });
    };

    const alertDeleteFailure = (str) => {
        Swal.fire({
            title: `${str} 삭제에 실패하였습니다`,
            text: "",
            icon: "error"
        });
    };

    const alertDeleteConfirmation = (str) => {
        return new Promise((resolve) => {
            Swal.fire({
                title: `${str}을 정말 삭제하시겠습니까?`,
                text: "",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Delete"
            }).then((result) => {
                if (result.isConfirmed) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    };

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
            }).catch(err => {
                console.log(err);
            })
        }
    }, [])

    // 댓글 추가
    const [insertReply, setInsertReply] = useState({ contents: "", parentSeq: seq });
    const insertReplyHandleChange = (e) => {
        setInsertReply(prev => ({ ...prev, contents: e.target.value }));
    }

    const insertReplyAdd = () => {

        if (insertReply.contents === "") {
            Swal.fire("내용을 입력해주세요");
            return;
        }

        axios.post("/api/reply", insertReply).then(resp => {
            Swal.fire("댓글 등록 성공");
            setInsertReply(prev => ({ ...prev, contents: "" }));
            setReplyList(resp.data.sort(compareBySeq));
        }).catch(err => {
            Swal.fire("댓글 등록 실패");
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
        setUpdateReply(prev => ({ ...prev, contents: e.target.value }))
    }

    const updateAdd = () => {
        if (updateReply.contents === "") {
            Swal.fire("내용을 입력해주세요");
            return;
        }

        axios.put("/api/reply", updateReply).then(resp => {
            Swal.fire("댓글 수정에 성공하였습니다");
            setReplyList(resp.data.sort(compareBySeq));
            setUpdateReply(prev => ({ seq: 0, contents: "" }));
            setVisibleUpdateBox(0);

        }).catch(err => {
            Swal.fire("댓글 수정에 실패하였습니다.");
            console.log(err);
        })
    }

    // 게시글 삭제
    const contentsDel = (seq) => {
        let imgList = existImgSearch(boardContents.contents);
        let str = "게시글"
        alertDeleteConfirmation(str).then(result => {
            if (result) {
                axios.delete(`/api/board/${seq}`, { data: imgList }).then(resp => {
                    alertDeleteSuccess();
                    navi("/board/toFreeBoardList");
                }).catch(err => {
                    alertDeleteFailure();
                    console.log(err);
                })
            }
        })
    }

    const existImgSearch = (contents) => { // 게시글 내용에 존재하는 태그 뽑아내기 ( sysName )
        const imgSrcRegex = /<img[^>]*src=["']\/uploads\/board\/([^"']+)["'][^>]*>/g;
        let existImgList = [];
        let match;
        while ((match = imgSrcRegex.exec(contents)) !== null) {
            existImgList.push(match[1]);
        }
        return existImgList;
    }

    // 댓글 삭제
    const delReplyBtn = (seq) => {
        let str = "댓글"
        alertDeleteConfirmation(str).then(result => {
            if (result) {
                axios.delete(`/api/reply/${seq}`).then(resp => {
                    alertDeleteSuccess(str);
                    setReplyList(replyList.filter(e => e.seq !== seq))
                }).catch(err => {
                    alertDeleteFailure(str);
                    console.log(err);
                })
            }
        })
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
            Swal.fire("파일 다운로드 중 에러가 발생하였습니다");
            console.log(err);
        })
    }

    return (
        <>
            <div className={style.boardContentsTitle}>{boardContents.title}</div>
            <div className={style.boardContentsInfo}>
                <div>
                    작성자 {boardContents.writer} | 날짜 {boardContents.writeDate ? boardContents.writeDate.split("T")[0] : ""} | 조회수 {boardContents.viewCount}
                </div>
                <div>
                    {loginId === boardContents.writer || admin !== null ? <button onClick={() => { contentsDel(seq) }}>삭제</button> : ""}
                </div>
            </div>
            <div>
                <div className={style.fileBox}>
                    <div>첨부파일 목록</div>
                    {
                        fileList.map((e, i) => {
                            return (

                                <div>
                                    <div key={i} onClick={() => downloadFile(e.sysName, e.oriName)}>파일 {i + 1} | <span className={style.fileName}>{e.oriName}</span></div>
                                </div>

                            );
                        })
                    }
                </div>
            </div>
            <div className={style.boardContentsDiv} dangerouslySetInnerHTML={{ __html: boardContents.contents }}></div>
            <div className={style.btns}>
                <Link to="/board/toFreeBoardList" state={{ searchText: location.state !== null && location.state.searchText != null ? location.state.searchText : "" }}><button>뒤로가기</button></Link>
                {loginId === boardContents.writer || admin !== null ?
                    <Link to="/board/toEditFreeBoardContents" state={{ sysSeq: seq }}><button>수정하기</button></Link> : ""
                }
            </div>
            <hr />
            <div>
                <div className={style.insertReplyDiv}>
                    <div>
                        <textarea placeholder="댓글을 입력해주세요" onChange={insertReplyHandleChange} value={insertReply.contents} />
                    </div>
                </div>
                <div className={style.insertReplyBtn}>
                    <button onClick={insertReplyAdd}>등록</button>
                </div>
            </div>
            <hr className={style.replyListStartHr} />
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
                                            {loginId === e.writer || admin !== null ?
                                                <><button onClick={() => hideUpdateBox(e.seq)}>취소</button><button onClick={updateAdd}>수정완료</button></> :
                                                ""
                                            }
                                        </div>
                                        :
                                        <div className={style.replyListBtn}>
                                            {loginId === e.writer || admin !== null ?
                                                <><button onClick={() => showUpdateBox(e.seq, e.contents)}>수정</button><button onClick={() => delReplyBtn(e.seq)}>삭제</button></> :
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
                                    visibleUpdateBox === e.seq ? <div><textarea value={updateReply.contents} onChange={updateHandle}></textarea></div> : <div>{e.contents}</div>
                                }
                                {
                                    visibleUpdateBox === e.seq ?
                                        <div>
                                            {loginId === e.writer || admin !== null ?
                                                <><button onClick={() => hideUpdateBox(e.seq)}>취소</button><button onClick={updateAdd}>수정완료</button></> :
                                                ""
                                            }
                                        </div>
                                        :
                                        <div className={style.replyListBtn}>
                                            {loginId === e.writer || admin !== null ?
                                                <><button onClick={() => showUpdateBox(e.seq, e.contents)}>수정</button><button onClick={() => delReplyBtn(e.seq)}>삭제</button></> :
                                                ""
                                            }
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

export default FreeBoardContents;