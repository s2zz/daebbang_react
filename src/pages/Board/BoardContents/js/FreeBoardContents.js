import style from '../css/BoardContents.module.css';
import { Link } from "react-router-dom";

const FreeBoardContents = () => {
    return (
        <>
            <div className={style.boardContentsTitle}>제목</div>
            <div className={style.boardContentsInfo}>
                <div>
                    글 번호 1 | 작성자 test0000 | 날짜 2023.12.03
                </div>
                <div>
                    <button>삭제</button>
                </div>
            </div>
            <div className={style.boardContentsDiv}>
                글 내용 나오는 곳
            </div>
            <div>
                <Link to="/board/toFreeBoardList"><button>뒤로가기</button></Link>
                <button>수정하기</button>
            </div>
            <hr />
            <div>
                <div className={style.insertReplyDiv}>
                    <div>
                        <textarea placeholder="댓글을 입력해주세요"/>
                    </div>
                </div>
                <div>
                    <button>등록</button>
                </div>
            </div>
            <hr/>
            <div className={style.replyBoxFirst}>
                <div className={style.replyInfo}>
                    <div>test0000</div>
                    <div>2023.12.06</div>
                </div>
                <div>
                    댓글내용
                </div>
                <div>
                    <button>수정</button>
                    <button>삭제</button>
                </div>
            </div>
            <div className={style.replyBox}>
                <div className={style.replyInfo}>
                    <div>test0000</div>
                    <div>2023.12.06</div>
                </div>
                <div>
                    댓글내용
                </div>
                <div>
                    <button>수정</button>
                    <button>삭제</button>
                </div>
            </div>
            <div className={style.naviFooter}>
                &lt; 1 2 3 4 5 6 7 8 9  10 &gt;
            </div>
        </>
    )
}

export default FreeBoardContents;