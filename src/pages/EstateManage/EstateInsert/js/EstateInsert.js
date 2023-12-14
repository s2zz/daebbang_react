import { useState } from "react";
import axios from "axios";
import style from '../css/EstateInsert.module.css';
import { useNavigate } from "react-router-dom";
import EstateInsert1 from './EstateInsert1';
import EstateInsert2 from './EstateInsert2';
import EstateInsert3 from './EstateInsert3';

function EstateInsert() {
  const navi = useNavigate();

  // 옵션 리스트
  const [optionList, setOptionList] = useState([]);
  // 이미지 파일
  const [estateImages, setEstateImages] = useState([]);
  // 관리비 유무
  const [maintenanceOption, setMaintenanceOption] = useState("true");

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
    memo: ""
  });

  const handleReturn = () => {
    navi("/EstateManage");
  }

  const handleSubmit = () => {
    // 필수 항목
    const requiredFields = [
      'roomCode', 'structureCode', 'buildingCode', 'heatingCode', 'area', 'zipcode', 'address1', 'address2', 'latitude', 'longitude',
      'transactionCode', 'price', 'buildingFloors', 'roomFloors',
      'title', 'contents'];

    // 필수 항목이 비어있는지 검사
    if (requiredFields.some(name => !realEstate[name])) {
      alert("필수 항목을 입력해주세요");
      return false;
    }

    // 관리비 '있음' AND 관리비 입력 안한 경우 
    if (maintenanceOption === 'true' && realEstate.maintenanceCost === '') {
      alert("필수 항목을 입력해주세요");
      return false;
    }

    const imageLength = formData.getAll('images').length;
    if (imageLength < 3 || imageLength > 10) {
      alert("사진을 3장 이상 10장 이하로 등록해주세요.");
      return false;
    }

    const formData = new FormData();
    formData.append('realEstate', JSON.stringify(realEstate));
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
    <div className={style.container}>
      <EstateInsert1 realEstate={realEstate} setRealEstate={setRealEstate} />
      <EstateInsert2 realEstate={realEstate} setRealEstate={setRealEstate} setOptionList={setOptionList} maintenanceOption={maintenanceOption} setMaintenanceOption={setMaintenanceOption} />
      <EstateInsert3 setRealEstate={setRealEstate} estateImages={estateImages} setEstateImages={setEstateImages} />
      <div className={style.buttonDiv}>
        <button onClick={handleReturn}>이전으로</button>
        <button onClick={handleSubmit}>다음으로</button>
      </div>
    </div>
  );
}

export default EstateInsert;