import ReactQuill from "react-quill";
import style from "../../css/WriteBoard/WriteBoard.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";

const FreeBoardWrite = () => {
    const [boardContents, setBoardContents] = useState({board_title:"자유게시판",title:"",});


    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, false] }],
                ["header", "bold", "italic", "underline", "strike", "blockquote",
                    { list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" },
                    "bullet", "indent", "link", "image",
                    { align: [] }, { color: [] }, { background: [] },
                    "clean"]
            ],
        },
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "align",
        "color",
        "background",
        "link",
        "image",
    ];

    return (
        <>
            <div className={style.boardTitle}>자유게시판 글 작성</div>
            <hr></hr>
            <div>
                <div>제목</div>
                <div>
                    <input placeholder="제목을 입력해주세요" />
                </div>
            </div>
            <div>
                <div>파일첨부</div>
                <div><input type="file" /></div>
            </div>
            <div>
                <div>내용</div>
                <div>
                    <ReactQuill className={style.reactQuill} placeholder="내용을 입력해주세요" modules={modules} formats={formats} />
                </div>
            </div>

            <div>
                <Link to="/board/toFreeBoardList"><button>작성 취소</button></Link>
                <button>작성 완료</button>
            </div>
        </>
    );
}

export default FreeBoardWrite;