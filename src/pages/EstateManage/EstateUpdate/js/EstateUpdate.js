import { useState, useEffect } from "react";
import { Button } from 'reactstrap';
import axios from "axios";
import style from '../css/EstateUpdate.module.css';
import { useNavigate, useParams } from "react-router-dom";
import EstateUpdate1 from './EstateUpdate1';
import EstateUpdate2 from './EstateUpdate2';
import EstateUpdate3 from './EstateUpdate3';

function EstateUpdate() {
  const navi = useNavigate();
  const { estateId } = useParams();

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

  function validateFields(realEstate, maintenanceOption, showFloorInput) {
    const requiredFields = [
      'roomCode', 'structureCode', 'buildingCode', 'heatingCode', 'area', 'zipcode', 'address1', 'address2', 'latitude', 'longitude',
      'transactionCode', 'price', 'buildingFloors',
      'title', 'contents'
    ];

    if (requiredFields.some(name => !realEstate[name])) {
      alert("필수 항목을 입력해주세요");
      return false;
    }

    if (maintenanceOption === 'true' && realEstate.maintenanceCost === '') {
      alert("필수 항목을 입력해주세요");
      return false;
    }

    if (isNaN(realEstate.area) || realEstate.area === '') {
      alert("면적을 숫자로 입력해주세요");
      return false;
    }

    if (parseInt(realEstate.roomFloors) > parseInt(realEstate.buildingFloors)) {
      alert("방 층수는 건물의 층수보다 클 수 없습니다.");
      return false;
    }

    if (parseInt(realEstate.buildingFloors) < 1) {
      alert("건물의 층수는 1층보다 낮을 수 없습니다.");
      return false;
    }

    if (showFloorInput === 'f3' && (parseInt(realEstate.roomFloors) < 1 || realEstate.roomFloors === '')) {
      alert("해당 층수는 1층보다 낮을 수 없습니다.");
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
        alert("사진을 3장 이상 10장 이하로 등록해주세요.");
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
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [estateId]);

  return (
    <>
      <h1 className={style.bigTitle}>매물 수정</h1>
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
    </>
  );
}

export default EstateUpdate;
