import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "../../css/WriteBoard/WriteBoard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const RoomBoardWrite = ({ loginId }) => {
    const navi = useNavigate();
    const maxFileSize = 10 * 1024 * 1024;
    const quillRef = useRef();


    const login = () => {
        alert("로그인 후 이용가능한 서비스입니다");
        navi("/login");
        return;
    }

    const [formData, setFormData] = useState({
        title: "",
        header: "",
        contents: "",
        files: {}
    });

    const handleFileChange = (e) => {
        if(!loginId){login();}
        if (e.target.files[0].size > maxFileSize) {
            alert("파일 최대 사이즈는 10MB 입니다.");
            e.target.value = null;
            setFormData(prev => ({ ...prev }));
            return;
        } else {
            setFormData(prev => ({ ...prev, files: { ...prev.files, [e.target.name]: e.target.files[0] } }));
        }
    }

    const handleChange = (e) => {
        if(!loginId){login();}
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }

    const handleHeaderChange = (e) => {
        if(!loginId){login();}
        setFormData(prev => ({ ...prev, header: e.target.value }));
    }

    const [sysNameList, setSysNameList] = useState([]);

    const imageHandler = (file) => {
        if(!loginId){login();}
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
                    let sysName = imgUrl.data[i].split("https://storage.googleapis.com/daebbang/board/")[1];
                    setSysNameList(prev => [...prev, encodeURIComponent(sysName)]);
                    editor.insertEmbed(range.index, 'image', "https://storage.googleapis.com/daebbang/board/" + encodeURIComponent(sysName));
                }

            } catch (error) {
               
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
    const [modal1, setModal1] = useState(false);
    const toggle1 = () => {
        setModal1(!modal1);
    }

    const [modal2, setModal2] = useState(false);
    const toggle2 = () => {
        setModal2(!modal2);
    }

    const regex = () => {
        if(!loginId){login();}

        if (formData.title === "") {
            alert("제목을 입력해주세요");
            return;
        }

        if (formData.title.length > 50) {
            alert("제목은 최대 50글자 입니다");
            return;
        }

        if (formData.header === "말머리를 선택해주세요" || formData.header === "") {
            alert("말머리를 선택해주세요");
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

        if (formData.header === "양도합니다") {
            toggle1();
        } else if (formData.header === "양도 구합니다") {
            toggle2();
        }

    }

    const handleAdd = () => {
        if(!loginId){login();}
        let existImgList = existImgSearch(formData.contents);
        let delImgList = submitImgSearch(existImgList, sysNameList);

        const submitFormData = new FormData();
        submitFormData.append("boardTitle", "양도게시판");
        submitFormData.append("title", formData.title);
        submitFormData.append("contents", formData.contents);
        submitFormData.append("delImgList", delImgList);
        submitFormData.append("header", formData.header);

        let fileList = Object.values(formData.files);

        fileList.forEach((e) => {
            if (e !== "" && e instanceof File) {
                submitFormData.append("files", e);
            }
        });


        axios.post("/api/board", submitFormData).then(resp => {
            alert("게시글 등록에 성공하였습니다");
            navi("/board/toRoomBoardList");
        }).catch(err => {
            alert("게시글 등록에 실패하였습니다");
   
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

    const returnModal1 = () => {
        return (
            <div>
                <Modal isOpen={modal1} toggle={toggle1} >
                    <ModalHeader toggle={toggle1}>양도게시판 약관 동의</ModalHeader>
                    <ModalBody>
                        양도합니다 글 작성자는 집 주인의 동의를 받아 합법적이고 적절한 절차를 통해 진행되어야 하며,
                        집 주인의 동의를 받지 않는 등의 모든 문제는 당사자에게 책임이 있습니다.<br />
                        DAEBBANG은 양도 과정 및 양도된 집과 사용자 간의 거래에서 발생하는 법적 문제에 대한
                        어떠한 책임도 지지않습니다.<br />
                        따라서 양도 게시판을 통해 이루어지는 모든 거래 및 법적 절차는 거래 당사자 간의 독립적인 책임
                        아래 진행되며, 서비스 제공자는 이에 대한 법적 책임을 부담하지 않습니다.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleAdd}>
                            약관에 동의합니다
                        </Button>{' '}
                        <Button color="secondary" onClick={toggle1}>
                            취소
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    const returnModal2 = () => {
        return (
            <div>
                <Modal isOpen={modal2} toggle={toggle2} >
                    <ModalHeader toggle={toggle2}>양도게시판 약관 동의</ModalHeader>
                    <ModalBody>
                        양도구합니다 글 작성자는 반드시 거래하려는 사용자가 집주인의 동의를 구했는지,
                        법적으로 문제는 없는지 살펴보아야 합니다.<br />
                        DAEBBANG은 양도 과정 및 양도된 집과 사용자 간의 거래에서 발생하는 법적 문제에 대한
                        어떠한 책임도 지지않습니다.<br />
                        따라서 양도 게시판을 통해 이루어지는 모든 거래 및 법적 절차는 거래 당사자 간의 독립적인 책임
                        아래 진행되며, 서비스 제공자는 이에 대한 법적 책임을 부담하지 않습니다.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={handleAdd}>
                            약관에 동의합니다
                        </Button>{' '}
                        <Button color="secondary" onClick={toggle2}>
                            취소
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
    const [inputList, setInputList] = useState([{ name: "files0", show: false }, { name: "files1", show: false }, { name: "files2", show: false }, { name: "files3", show: false }, { name: "files4", show: false }]);
    const fileAdd = () => {
        if (inputList.filter(e => e.show).length > 4) {
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
    return (
        <>
            {toggle1 ? returnModal1(toggle1) : ""}
            {toggle2 ? returnModal2(toggle2) : ""}
            <div className={style.boardTitle}>양도게시판 글 작성</div>
            <hr></hr>
            <div className={style.titleBox}>
                <div>제목<span>*</span></div>
                <div>
                    <input placeholder="&nbsp;제목을 입력해주세요" name="title" onChange={handleChange} />
                </div>
            </div>
            <div className={style.headerBox}>
                <div>말머리<span>*</span></div>
                <div>
                    <select onChange={handleHeaderChange}>
                        <option selected>말머리를 선택해주세요</option>
                        <option>양도합니다</option>
                        <option>양도 구합니다</option>
                    </select>
                </div>
            </div>
            <div className={style.fileBox}>
                <div>파일첨부 <FontAwesomeIcon icon={faPlus} size="lg" onClick={fileAdd} /></div>
                <div className={style.fileInputDiv}>
                    {
                        inputList.map((e, i) => (
                            e.show ? (
                                <div key={i}>
                                    <input type="file" onChange={handleFileChange} name={e.name} />
                                    <span><FontAwesomeIcon icon={faXmark} size="lg" onClick={() => fileDel(e.name)} /></span>
                                </div>
                            ) : null
                        ))
                    }
                </div>
            </div>
            <div>
                <div className={style.contents}>내용<span>*</span></div>
                <div>
                    <ReactQuill modules={modules} formats={formats} className={style.reactQuill} ref={quillRef}
                        value={formData.contents}
                        onChange={(value) => {
                            if (value.length > 5000) {
                                alert("작성 가능한 글자 수 범위를 초과하였습니다.");
                                setFormData(prev => ({ ...prev }));
                            } else {
                                setFormData(prev => ({ ...prev, contents: value.slice(0, 5000) }));
                            }
                        }}
                    />
                </div>
            </div>

            <div className={style.btns}>
                <Link to="/board/toRoomBoardList"><button>작성 취소</button></Link>
                <button onClick={regex}>작성 완료</button>
            </div>
        </>
    );
}

export default RoomBoardWrite;