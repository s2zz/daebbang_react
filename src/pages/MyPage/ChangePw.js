import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import style from "./css/ChangePw.module.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

const ChangePw = () => {
    const storedLoginId = sessionStorage.getItem('loginId');
    const isEstate = sessionStorage.getItem('isEstate');
    const [pw, setPw] = useState({ pw: "" });
    const [cpw1, setPw1] = useState({ cpw1: "" });
    const [cpw2, setPw2] = useState({ cpw2: "" });
    const [pwRegex, setPwRegex] = useState(false);

    const handleChangePw = (e) => {
        const { name, value } = e.target;
        setPw(prev => ({ ...prev, [name]: value }));
    }

    const handleChangeCpw1 = (e) => {
        const { name, value } = e.target;
        setPw1(prev => ({ ...prev, [name]: value }));

        const pwregex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;

        if (pwregex.test(e.target.value)) {
            setPwRegex(true);
        }
    }

    const handleChangeCpw2 = (e) => {
        const { name, value } = e.target;
        setPw2(prev => ({ ...prev, [name]: value }));
    }

    const navi = useNavigate();

    const handleChange = () => {
        const formData = new FormData();
        formData.append("id", storedLoginId);
        formData.append("pw", pw.pw);
        axios.post("/api/member/login", formData).then(resp => {
            if (pwRegex) {
                if (cpw1.cpw1 == cpw2.cpw2) {
                    const formData2 = new FormData();
                    formData2.append("id", storedLoginId);
                    formData2.append("pw", cpw1.cpw1);
                    axios.post("/api/member/changePw", formData2).then(resp => {
                        Swal.fire({
                            icon: "success",
                            title: "비밀번호 변경이 완료되었습니다",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navi("/mypage");
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        text: "변경할 비밀번호를 다시 한 번 확인해주세요",
                    });
                }
            } else {
                Swal.fire({
                    text: "비밀번호는 8글자 이상의 영문, 숫자, 특수문자로 이루어져야합니다.",
                });
            }
        }).catch(resp => {
            Swal.fire({
                text: "비밀번호를 다시 확인해주세요.",
            });
        });
    }

    const handleEstateChange = () => {
        const formData = new FormData();
        formData.append("id", storedLoginId);
        formData.append("pw", pw.pw);
        axios.post("/api/estate/login", formData).then(resp => {
            if (pwRegex) {
                if (cpw1.cpw1 == cpw2.cpw2) {
                    const formData2 = new FormData();
                    formData2.append("id", storedLoginId);
                    formData2.append("pw", cpw1.cpw1);
                    axios.post("/api/estate/changePw", formData2).then(resp => {
                        Swal.fire({
                            icon: "success",
                            title: "비밀번호 변경이 완료되었습니다",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        navi("/mypage");
                        window.location.reload();
                    });
                } else {
                    Swal.fire({
                        text: "변경할 비밀번호를 다시 한 번 확인해주세요",
                    });
                }
            } else {
                Swal.fire({
                    text: "비밀번호는 8글자 이상의 영문, 숫자, 특수문자로 이루어져야합니다.",
                });
            }

        }).catch(resp => {
            Swal.fire({
                text: "비밀번호를 다시 확인해주세요.",
            });
        });
    }

    return (
        <div className={style.chaContainer}>
            <div className={style.backBtns}>
                <Link to="/mypage"><button className={style.backBtn}><FontAwesomeIcon icon={faArrowLeft} className={style.arrowLeft} /></button></Link>
            </div>
            <div className={style.titleBox}>
                <div className={style.title}>비밀번호 변경</div>
            </div>
            {!isEstate ?
                <div>
                    <div className={style.inputBox}>
                        <div>
                            현재 비밀번호<br></br>
                            <input type="password" name="pw" onChange={handleChangePw} value={pw.pw} placeholder='현재 비밀번호 입력' className={style.inputInfo}></input><br /><br />
                            변경 비밀번호<br></br>
                            <input type="password" name="cpw1" onChange={handleChangeCpw1} value={cpw1.cpw1} placeholder='새로운 비밀번호 입력' className={style.inputInfo}></input><br /><br />
                            변경 비밀번호 확인<br></br>
                            <input type="password" name="cpw2" onChange={handleChangeCpw2} value={cpw2.cpw2} placeholder='새로운 비밀번호 재입력' className={style.inputInfo}></input>
                        </div>
                    </div>
                    <div className={style.changeBtns}>
                        <div>
                            <button className={style.changeBtn} onClick={handleChange}>비밀번호 변경</button>
                        </div>
                    </div>
                </div>
                : <div>
                    <div className={style.inputBox}>
                        <div>
                            현재 비밀번호<br></br>
                            <input type="password" name="pw" onChange={handleChangePw} value={pw.pw} placeholder='현재 비밀번호 입력' className={style.inputInfo}></input><br /><br />
                            변경 비밀번호<br></br>
                            <input type="password" name="cpw1" onChange={handleChangeCpw1} value={cpw1.cpw1} placeholder='새로운 비밀번호 입력' className={style.inputInfo}></input><br /><br />
                            변경 비밀번호 확인<br></br>
                            <input type="password" name="cpw2" onChange={handleChangeCpw2} value={cpw2.cpw2} placeholder='새로운 비밀번호 재입력' className={style.inputInfo}></input>
                        </div>
                    </div>
                    <div className={style.changeBtns}>
                        <div>
                            <button className={style.changeBtn} onClick={handleEstateChange}>비밀번호 변경</button>
                        </div>
                    </div>
                </div>}
        </div>
    );
}

export default ChangePw;