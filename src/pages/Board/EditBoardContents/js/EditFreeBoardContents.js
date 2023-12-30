import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "../../Write/css/WriteBoard/WriteBoard.module.css";
import eStyle from "../css/EditBoard.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from "../../../commons/Loading";

const EditFreeBoardContents = ({ loginId }) => {
    const location = useLocation();
    const [loading, setLoading] = React.useState(true);
    const navi = useNavigate();
    useEffect(() => {
        if (loginId === null) {
            alert("로그인해주세요")
            navi("/login");
        }
    }, []);
    const quillRef = useRef();
    const [formData, setFormData] = useState({
        set: 0,
        title: "",
        contents: "",
        files: {}
    });
    const [fileList, setFileList] = useState([{}]);
    const [sysNameList, setSysNameList] = useState([]);
    // 게시글 내용 받아오기
    useEffect(() => {
        axios.get(`/api/board/boardContents/${location.state.sysSeq}`).then(resp => {
            setFormData(prev => ({ ...prev, title: resp.data.title, contents: resp.data.contents, seq: resp.data.seq }));
            setFileList(resp.data.files);
            setSysNameList(prev => existImgSearch(resp.data.contents));
            setLoading(false);
        }).catch(err => {
            console.log(err);
        })
    }, []);

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, files: { ...prev.files, [e.target.name]: e.target.files[0] } }));
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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
                console.log(imgUrl.data);
                for (let i = 0; i < imgUrl.data.length; i++) {
                    let sysName = imgUrl.data[i].split("https://storage.googleapis.com/daebbang/board/")[1];
                    setSysNameList(prev => [...prev, encodeURIComponent(sysName)]);
                    editor.insertEmbed(range.index, 'image', "https://storage.googleapis.com/daebbang/board/" + encodeURIComponent(sysName));
                }

            } catch (error) {
                console.log(error);
            }
        })
    }

    let existImgSearch = (contents) => { // 게시글 내용에 존재하는 태그 뽑아내기 ( sysName )
        const imgSrcRegex = /<img[^>]*src=["']\/uploads\/board\/([^"']+)["'][^>]*>/g;
        let existImgList = [];
        let match;
        while ((match = imgSrcRegex.exec(contents)) !== null) {
            existImgList.push(match[1]);
        }
        return existImgList;
    }

    let submitImgSearch = (uploadList, sysNameList) => { // 삭제된 이미지 태그 뽑아내기
        let exist = false;
        let delImgList = [];
        for (let i = 0; i < sysNameList.length; i++) {
            for (let j = 0; j < uploadList.length; j++) {
                if (sysNameList[i] === uploadList[j]) {
                    exist = true;
                    break;
                }
            }
            exist ? exist = false : delImgList.push(sysNameList[i]);
        }
        return delImgList;
    }

    const [delFileList, setDelFileList] = useState([]);
    const handleRemoveFileChange = (sysName) => {
        if (window.confirm("파일을 정말 삭제하시겠습니까?")) {
            setDelFileList(prev => [...prev, sysName]);
            setFileList(fileList.filter(e => e.sysName !== sysName));
            alert("삭제되었습니다");
        }
    }

    const handleAdd = () => {
        console.log(delFileList);

        let existImgList = existImgSearch(formData.contents);
        let delImgList = submitImgSearch(existImgList, sysNameList);

        if (formData.title === "") {
            alert("제목을 입력해주세요");
            return;
        }

        if (formData.title.length > 50) {
            alert("제목은 최대 50글자 입니다");
            return;
        }

        if (formData.contents === "") {
            alert("내용을 입력해주세요");
            return;
        }

        if (formData.contents.length > 5000) {
            alert("내용은 최대 5000글자 입니다");
            return;
        }
        console.log(delFileList);
        const submitFormData = new FormData();
        submitFormData.append("boardTitle", "자유게시판");
        submitFormData.append("seq", formData.seq);
        submitFormData.append("title", formData.title);
        submitFormData.append("contents", formData.contents);
        submitFormData.append("delImgList", delImgList);
        submitFormData.append("delFileList", delFileList);
        console.log(delImgList);
        let fileList = Object.values(formData.files);

        fileList.forEach((e) => {
            if (e !== "" && e instanceof File) {
                submitFormData.append("files", e);
            }
        });

        axios.put("/api/board", submitFormData).then(resp => {
            alert("게시글 수정에 성공하였습니다");
            navi("/board/toFreeBoardContents", { state: { sysSeq: location.state.sysSeq } });
        }).catch(err => {
            alert("게시글 수정에 실패하였습니다");
            console.log(err);
        })
    }

    const numberOfInputs = 5 - fileList.length;
    const [inputList, setInputList] = useState([{ name: "files0", show: false }, { name: "files1", show: false }, { name: "files2", show: false }, { name: "files3", show: false }, { name: "files4", show: false }]);
    const fileAdd = () => {
        if (inputList.filter(e => e.show).length > numberOfInputs - 1) {
            alert("파일은 최대 5개까지 첨부 가능합니다");
            return;
        }

        let check = false;
        let array = inputList.map((e, i) => {
            if (!check && e.show === false) {
                e.show = true;
                check = true;
            }
            return e;
        })
        setInputList([...array]);
    }

    const fileDel = (name) => {

        let array = inputList.map((e, i) => {
            if (e.name === name) {
                e.show = false;
            }
            return e;
        })
        setFormData(prev => ({ ...prev, files: { ...prev.files, [name]: null } }));
        setInputList([...array]);

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
            {loading ? <Loading></Loading> :
                <>
                    <div className={style.boardTitle}>자유게시판 글 수정</div>
                    <hr></hr>
                    <div className={style.titleBox}>
                        <div>제목<span>*</span></div>
                        <div>
                            <input placeholder="제목을 입력해주세요" name="title" onChange={handleChange} value={formData.title} maxLength="50" />
                        </div>
                    </div>
                    <div className={eStyle.fileBox}>
                        <div>파일 목록</div>
                        {
                            fileList.length > 0 ?
                            fileList.map((e, i) => {
                                return (
                                    <div key={i}>
                                        {e.oriName}
                                        <FontAwesomeIcon icon={faXmark} style={{ paddingLeft: "10px" }} onClick={() => { handleRemoveFileChange(e.sysName) }} />
                                    </div>
                                );
                            }) : 
                            <div>첨부파일이 없습니다.</div>
                        }
                    </div>
                    <div className={style.fileBox}>
                        <div>파일첨부 <FontAwesomeIcon icon={faPlus} size="lg" onClick={fileAdd} /></div>
                        <div className={style.fileInputDiv}>
                            {
                                inputList.filter(e=>e.show===true).length>0 ?
                                inputList.map((e, i) => (
                                    e.show ? (
                                        <div key={i}>
                                            <input type="file" onChange={handleFileChange} name={e.name} />
                                            <span><FontAwesomeIcon icon={faXmark} size="lg" onClick={() => fileDel(e.name)} /></span>
                                        </div>
                                    ) : null
                                )) :
                                <div>선택된 파일이 없습니다.</div>
                            }
                        </div>
                    </div>
                    <div>
                        <div className={style.contents}>내용<span>*</span></div>
                        <div>
                            <ReactQuill modules={modules} formats={formats} className={style.reactQuill} ref={quillRef}
                                value={formData.contents} onChange={(value) => {
                                    if (value.length > 5000) {
                                        alert("최대 5000자까지 작성 가능합니다");
                                        setFormData(prev => ({ ...prev }));
                                    } else {
                                        setFormData(prev => ({ ...prev, contents: value.slice(0, 5000) }));
                                    }
                                }} />
                        </div>
                    </div>

                    <div className={style.btns}>
                        <Link to="/board/toFreeBoardContents" state={{ sysSeq: location.state.sysSeq }}><button>작성 취소</button></Link>
                        <button onClick={handleAdd}>수정 완료</button>
                    </div>
                </>}
        </>
    );
}

export default EditFreeBoardContents;