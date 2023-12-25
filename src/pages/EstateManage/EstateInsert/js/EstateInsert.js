import { useState } from "react";
import { Button, Modal, ModalBody } from 'reactstrap';
import axios from "axios";
import style from '../css/EstateInsert.module.css';
import moduleStyle from "../../../commons/Modal.module.css";
import { useNavigate } from "react-router-dom";
import EstateInsert1 from './EstateInsert1';
import EstateInsert2 from './EstateInsert2';
import EstateInsert3 from './EstateInsert3';

import 'bootstrap/dist/css/bootstrap.min.css';

function EstateInsert() {
  const navi = useNavigate();

  // 옵션 리스트
  const [optionList, setOptionList] = useState([]);
  // 이미지 파일
  const [estateImages, setEstateImages] = useState([]);
  // 관리비 유무
  const [maintenanceOption, setMaintenanceOption] = useState("true");
  // 반지하, 옥탑 확인(f1=반지하, f2=옥탑, f3=해당없음)
  const [showFloorInput, setShowFloorInput] = useState("f3");

  // 보낼 데이터
  const [realEstate, setRealEstate] = useState({
    roomCode: "",
    structureCode: "",
    buildingCode: "",
    heatingCode: "",
    area: "",
    zipcode: "",
    address1: "",
    address2: "",
    latitude: "",
    longitude: "",
    transactionCode: "t1",
    deposit: "",
    price: "",
    maintenanceCost: "",
    roomFloors: "",
    buildingFloors: "",
    title: "",
    contents: "",
    writer: "",
    memo: ""
  });

  const handleReturn = () => {
    navi("/EstateManage");
  }

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [modalMessage, setModalMessage] = useState("필수 항목을 입력해주세요.");

  const modalContent = (
    <Modal isOpen={show} toggle={handleClose}>
      <ModalBody className={moduleStyle.alertBody}>
        {modalMessage}
        <br></br>
        <Button color="primary" className={moduleStyle.alertBtn} onClick={handleClose}>닫기</Button>
      </ModalBody>
    </Modal>
  );

  function setValidateMessage(fieldName) {
    console.log(fieldName);


    if (fieldName === 'roomCode') {
      setModalMessage("방 종류를 선택해주세요.");
    } else if (fieldName === 'structureCode') {
      setModalMessage("방 구조를 선택해주세요.");
    } else if (fieldName === 'buildingCode') {
      setModalMessage("건물 유형를 선택해주세요.");
    } else if (fieldName === 'heatingCode') {
      setModalMessage("난방 종류를 선택해주세요.");
    } else if (fieldName === 'area') {
      setModalMessage("매물 크기를 입력해주세요.");
    } else if (fieldName === 'transactionCode') {
      setModalMessage("거래 종류를 선택해주세요.");
    } else if (fieldName === 'price') {
      setModalMessage("월세(전세) 가격을 입력해주세요.");
    } else if (fieldName === 'roomFloors') {
      setModalMessage("해당 층수를 입력해주세요.");
    } else if (fieldName === 'buildingFloors') {
      setModalMessage("건물 층수를 입력해주세요.");
    } else if (fieldName === 'title') {
      setModalMessage("제목을 입력해주세요.");
    } else if (fieldName === 'contents') {
      setModalMessage("내용을 입력해주세요.");
    } else {
      setModalMessage("주소를 입력해주세요.");
    }

  }

  function validateFields(realEstate, maintenanceOption, showFloorInput) {
    const requiredFields = [
      'roomCode', 'structureCode', 'buildingCode', 'heatingCode', 'area', 'zipcode', 'address1', 'address2', 'latitude', 'longitude',
      'transactionCode', 'price', 'roomFloors', 'buildingFloors',
      'title', 'contents'
    ];

    if (requiredFields.some(name => !realEstate[name])) {
      const fieldName = requiredFields.find(name => !realEstate[name]);

      setValidateMessage(fieldName);
      handleShow();
      return false;
    }

    if (maintenanceOption === 'true' && realEstate.maintenanceCost === '') {
      setModalMessage("관리비를 입력해주세요.");
      handleShow();
      return false;
    }

    if (isNaN(realEstate.area) || realEstate.area === '') {
      setModalMessage("면적을 숫자로 입력해주세요");
      handleShow();
      return false;
    }

    if (parseInt(realEstate.roomFloors) > parseInt(realEstate.buildingFloors)) {
      setModalMessage("방 층수는 건물의 층수보다 클 수 없습니다.");
      handleShow();
      return false;
    }

    if (parseInt(realEstate.buildingFloors) < 1) {
      setModalMessage("건물의 층수는 1층보다 낮을 수 없습니다.");
      handleShow();
      return false;
    }

    if (showFloorInput === 'f3' && (parseInt(realEstate.roomFloors) < 1 || realEstate.roomFloors === '')) {
      setModalMessage("해당 층수는 1층보다 낮을 수 없습니다.");
      handleShow();
      return false;
    }

    return true;
  }

  const handleSubmit = () => {
    console.log(realEstate);

    if (!validateFields(realEstate, maintenanceOption, showFloorInput)) {
      return false;
    }

    const imageLength = estateImages.length;

    if (imageLength < 3 || imageLength > 10) {
      setModalMessage("사진을 3장 이상 10장 이하로 등록해주세요.");
      handleShow();

      return false;
    }

    const formData = new FormData();

    formData.append('realEstate', JSON.stringify({ ...realEstate, writer: sessionStorage.getItem('loginId') }));
    formData.append('optionList', JSON.stringify(optionList));

    for (const image of estateImages) {
      formData.append("estateImages", image);
    }

    axios.post("/api/estateManage/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(resp => {
        console.log(resp);
        navi("/EstateManage");
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  return (
    <>
      {modalContent}
      <h1 className={style.bigTitle}>방내놓기</h1>
      <div className={style.container}>
        <p className={style.explanation}>전/ 월세 매물만 등록할 수 있습니다.</p>
        <p className={style.explanation}>주소를 다르게 입력할 경우 허위매물로 신고될 수 있으니 꼭 동일하게 입력 바랍니다.</p>
        <EstateInsert1 realEstate={realEstate} setRealEstate={setRealEstate} />
        <EstateInsert2 realEstate={realEstate} setRealEstate={setRealEstate} setOptionList={setOptionList}
          maintenanceOption={maintenanceOption} setMaintenanceOption={setMaintenanceOption}
          showFloorInput={showFloorInput} setShowFloorInput={setShowFloorInput} />
        <EstateInsert3 setRealEstate={setRealEstate} setEstateImages={setEstateImages} />
        <div className={style.buttonDiv}>
          <Button className={style.estateBtn} onClick={handleReturn}>이전으로</Button>
          <Button onClick={handleSubmit}>다음으로</Button>
        </div>
      </div>
    </>
  );
}

export default EstateInsert;
