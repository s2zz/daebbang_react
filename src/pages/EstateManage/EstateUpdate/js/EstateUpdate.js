import { useState, useEffect } from "react";
import { Button, Modal, ModalBody } from 'reactstrap';
import axios from "axios";
import style from '../css/EstateUpdate.module.css';
import moduleStyle from "../../../commons/Modal.module.css";
import { useNavigate, useParams } from "react-router-dom";
import EstateUpdate1 from './EstateUpdate1';
import EstateUpdate2 from './EstateUpdate2';
import EstateUpdate3 from './EstateUpdate3';
import Loading from '../../../commons/Loading';

function EstateUpdate() {
  const navi = useNavigate();
  const { estateId } = useParams();
  const [loading, setLoading] = useState(true);

  // 옵션 리스트
  const [optionList, setOptionList] = useState([]);
  // 이미지 파일
  const [estateImages, setEstateImages] = useState([]);
  // 임시 이미지
  const [tempImages, setTempImages] = useState([]);
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
      'transactionCode', 'price', 'buildingFloors',
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
      setModalMessage("해당 층수는 건물의 층수보다 클 수 없습니다.");
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

    // 이미지를 삽입했을 경우
    if (imageLength > 0) {
      // 3장 이상 10장 이하로 넣어야만 함
      if (imageLength < 3 || imageLength > 10) {
        setModalMessage("사진을 3장 이상 10장 이하로 등록해주세요.");
        handleShow();
        return false;
      }
    }

    const formData = new FormData();

    formData.append('realEstate', JSON.stringify(realEstate));
    formData.append('optionList', JSON.stringify(optionList));

    for (const image of estateImages) {
      formData.append("estateImages", image);
    }

    axios.put(`/api/estateManage/estateUpdate/${estateId}`, formData, {
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
        console.log(formData);
      });
  }

  useEffect(() => {
    axios.get(`/api/estateManage/estateInfo/${estateId}`)
      .then(resp => {
        console.log("Fetched data:", resp.data);

        setRealEstate({
          roomCode: resp.data.room.roomId,
          structureCode: resp.data.structure.structureId,
          buildingCode: resp.data.building.buildingId,
          heatingCode: resp.data.heatingSystem.heatingId,
          area: resp.data.area,
          zipcode: resp.data.zipcode,
          address1: resp.data.address1,
          address2: resp.data.address2,
          latitude: resp.data.latitude,
          longitude: resp.data.longitude,
          transactionCode: resp.data.transaction.transactionId,
          deposit: resp.data.deposit,
          price: resp.data.price,
          maintenanceCost: resp.data.maintenanceCost,
          roomFloors: resp.data.roomFloors,
          buildingFloors: resp.data.buildingFloors,
          title: resp.data.title,
          contents: resp.data.contents,
          writer: resp.data.writer,
          memo: resp.data.memo
        });

        setOptionList(resp.data.optionList.map((option) => option.optionTitle.optionId));

        if (resp.data.maintenanceCost === 0) {
          setMaintenanceOption("false");
        } else {
          setMaintenanceOption("true");
        }

        if (resp.data.roomFloors === -1) {
          setShowFloorInput("f1");
        } else if (resp.data.roomFloors === 0) {
          setShowFloorInput("f2");
        }

        // 이미지 태그를 상태에 설정
        setTempImages(resp.data.images);

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [estateId]);

  return (
    <>
      {modalContent}
      <h1 className={style.bigTitle}>매물 수정</h1>
      {loading ? <Loading></Loading> : (
        <div className={style.container}>
          <EstateUpdate1 realEstate={realEstate} setRealEstate={setRealEstate} />
          <EstateUpdate2 realEstate={realEstate} setRealEstate={setRealEstate} optionList={optionList} setOptionList={setOptionList}
            maintenanceOption={maintenanceOption} setMaintenanceOption={setMaintenanceOption} showFloorInput={showFloorInput} setShowFloorInput={setShowFloorInput} />
          <EstateUpdate3 realEstate={realEstate} setRealEstate={setRealEstate} tempImages={tempImages} setEstateImages={setEstateImages} />
          <div className={style.buttonDiv}>
            <Button className={style.estateBtn} onClick={handleReturn}>이전으로</Button>
            <Button className={style.estateBtn} onClick={handleSubmit}>다음으로</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default EstateUpdate;
