import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "../../css/WriteBoard/WriteBoard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef } from "react";
import axios from "axios";

const FreeBoardWrite = () => {
    const navi = useNavigate();
    const quillRef = useRef();
    const [formData, setFormData] = useState({
        title: "",
        contents: "",
        files: []
    });
    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, files: [...prev.files, e.target.files[0]] }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleAdd = () => {
        if (formData.title === "") {
            alert("제목을 입력해주세요");
            return;
        }

        if (formData.title > 50) {
            alert("제목은 최대 50글자 입니다");
            return;
        }

        if (formData.contents === "") {
            alert("내용을 입력해주세요");
            return;
        }

        if (formData.contents.length > 3000) {
            alert("내용은 최대 3000글자 입니다");
            return;
        }

        const submitFormData = new FormData();
        submitFormData.append("boardTitle", "자유게시판");
        submitFormData.append("title", formData.title);
        submitFormData.append("contents", formData.contents);
        console.log(formData.files);
        formData.files.forEach((e) => {
            submitFormData.append("files", e);
        });
        axios.post("/api/board", submitFormData).then(resp => {
            alert("게시글 등록에 성공하였습니다");
            navi("/board/toFreeBoardList");
        }).catch(err => {
            alert("게시글 등록에 실패하였습니다");
            console.log(err);
        })
    }

    const imageHandler = (file) => {
        // 이미지 선택 창 나타나게 하기
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("multiple", "true");
        input.setAttribute("accept", "image/*");
        input.click();

        // 이미지 선택 시 동작
        input.addEventListener("change", async () => {
            const files = input.files;

            const formImg = new FormData();
            for (let i = 0; i < files.length; i++) {
                formImg.append("files", files[i]);
            }
            try {
                 const imgUrl = await axios.post("/api/file/upload", formImg);
                const editor = quillRef.current.getEditor();
                const range = editor.getSelection();
        
                for (let i = 0; i < imgUrl.data.length; i++) {
                    editor.insertEmbed(range.index, 'image', imgUrl.data[i]);
                }
            } catch (error) {
                console.log(error);
            }

        })
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ header: [1, 2, 3, 4, 5, false] }],
                ["header", "bold", "italic", "underline", "strike", "blockquote",
                    { list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" },
                    "bullet", "indent", "link", "image",
                    { align: [] }, { color: [] }, { background: [] },
                    "clean"]
            ],
            handlers: { image: imageHandler, },
        }
    }), []);

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
                    <input placeholder="제목을 입력해주세요" name="title" onChange={handleChange} />
                </div>
            </div>
            <div>
                <div>파일첨부</div>
                <div><input type="file" onChange={handleFileChange} /></div>
                <div><input type="file" onChange={handleFileChange} /></div>
                <div><input type="file" onChange={handleFileChange} /></div>
                <div><input type="file" onChange={handleFileChange} /></div>
                <div><input type="file" onChange={handleFileChange} /></div>
            </div>
            <div>
                <div>내용</div>
                <div>
                    <ReactQuill modules={modules} formats={formats} className={style.reactQuill} ref={quillRef}
                        value={formData.contents} onChange={(value) => setFormData({ ...formData, contents: value })} />
                </div>
            </div>

            <div>
                <Link to="/board/toFreeBoardList"><button>작성 취소</button></Link>
                <button onClick={handleAdd}>작성 완료</button>
            </div>
        </>
    );
}

export default FreeBoardWrite;