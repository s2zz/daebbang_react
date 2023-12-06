import ReactQuill from "react-quill";
import style from "../../commons_css/WriteBoard.module.css";
import { Link } from "react-router-dom";

const RoomBoardWrite = () => {
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
            <div className={style.boardTitle}>양도게시판 글 작성</div>
            <hr></hr>
            <div>
                <div>제목</div>
                <div>
                    <input placeholder="제목을 입력해주세요" />
                </div>
            </div>
            <div>
                <div>말머리</div>
                <div>
                    <select>
                        <option selected>말머리를 선택해주세요</option>
                        <option>양도합니다</option>
                        <option>양도 구합니다</option>
                    </select>
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
                <Link to="/board/toRoomBoardList"><button>작성 취소</button></Link>
                <button>작성 완료</button>
            </div>
        </>
    );
}

export default RoomBoardWrite;