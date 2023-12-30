import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import style from "../../Write/css/WriteBoard/WriteBoard.module.css";
import eStyle from "../css/EditBoard.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import React, { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loading from '../../../commons/Loading';

const EditRoomBoardContents = ({ loginId }) => {
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
        seq: 0,
        title: "",
        header: "",
        contents: "",
        files: {}
    });

    function compareBySeq(a, b) {
        return b.seq - a.seq;
    }
    const [fileList, setFileList] = useState([{}]);
    const [sysNameList, setSysNameList] = useState([]);

    useEffect(() => {
        axios.get(`/api/board/boardContents/${location.state.sysSeq}`).then(resp => {
            console.log(resp.data);
            setFormData(prev => ({ ...prev, title: resp.data.title, contents: resp.data.contents, seq: resp.data.seq, header: resp.data.header }));
            setFileList(resp.data.files.sort(compareBySeq));
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

    const handleHeaderChange = (e) => {
        setFormData(prev => ({ ...prev, header: e.target.value }));
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

    const [modal1, setModal1] = useState(false);
    const toggle1 = () => {
        setModal1(!modal1);
    }

    const [modal2, setModal2] = useState(false);
    const toggle2 = () => {
        setModal2(!modal2);
    }

    const regex = () => {
        if (formData.title === "") {
            alert("제목을 입력해주세요");
            return;
        }

        if (formData.title > 50) {
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

    const handleAdd = () => {
        let existImgList = existImgSearch(formData.contents);
        let delImgList = submitImgSearch(existImgList, sysNameList);

        const submitFormData = new FormData();
        submitFormData.append("boardTitle", "양도게시판");
        submitFormData.append("title", formData.title);
        submitFormData.append("seq", formData.seq);
        submitFormData.append("contents", formData.contents);
        submitFormData.append("delImgList", delImgList);
        submitFormData.append("header", formData.header);
        submitFormData.append("delFileList", delFileList);

        let fileList = Object.values(formData.files);

        fileList.forEach((e) => {
            if (e !== "" && e instanceof File) {
                submitFormData.append("files", e);
            }
        });

        axios.put("/api/board", submitFormData).then(resp => {
            alert("게시글 등록에 성공하였습니다");
            navi("/board/toRoomBoardContents", { state: { sysSeq: location.state.sysSeq } });
        }).catch(err => {
            alert("게시글 등록에 실패하였습니다");
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
            {loading ? <Loading></Loading> : <>
                {toggle1 ? returnModal1(toggle1) : ""}
                {toggle2 ? returnModal2(toggle2) : ""}
                <div className={style.boardTitle}>양도게시판 글 수정</div>
                <hr></hr>
                <div className={style.titleBox}>
                    <div>제목<span>*</span></div>
                    <div>
                        <input placeholder="제목을 입력해주세요" name="title" onChange={handleChange} value={formData.title} maxLength="50" />
                    </div>
                </div>
                <div className={style.headerBox}>
                    <div>말머리<span>*</span></div>
                    <div>
                        <select onChange={handleHeaderChange}>
                            {formData.header === '양도합니다'
                                ? (<><option selected>양도합니다</option><option>양도 구합니다</option></>)
                                : (<><option>양도합니다</option><option selected>양도 구합니다</option></>)
                            }
                        </select>
                    </div>
                </div>
                <div className={eStyle.fileBox}>
                    <div>파일 목록</div>
                    {
                        fileList.lnegth>0 ?
                        fileList.map((e, i) => {
                            return (
                                <div key={i}>
                                    {e.oriName}
                                    <FontAwesomeIcon icon={faXmark} style={{ paddingLeft: "10px" }} onClick={() => { handleRemoveFileChange(e.sysName) }} />
                                </div>
                            );
                        }) :
                        <div>첨부 파일이 없습니다.</div>
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
                                    setFormData(prev => ({ ...prev, contents: value }));
                                }
                            }} />
                    </div>
                </div>

                <div className={style.btns}>
                    <Link to="/board/toRoomBoardContents" state={{ sysSeq: location.state.sysSeq }}><button>작성 취소</button></Link>
                    <button onClick={regex}>수정 완료</button>
                </div>
            </>}
        </>
    );
}

export default EditRoomBoardContents;