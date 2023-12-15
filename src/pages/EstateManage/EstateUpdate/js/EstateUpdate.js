import { useState, useEffect } from "react";
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

    const formData = new FormData();

    const imageLength = estateImages.length;

    if (imageLength < 3 || imageLength > 10) {
      alert("사진을 3장 이상 10장 이하로 등록해주세요.");
      return false;
    }
    
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
      });
  }

  useEffect(() => {
    axios.get(`/api/estateManage/estateUpdate/${estateId}`)
      .then(resp => {
        console.log("Fetched data:", resp.data);
        
        setRealEstate(resp.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [estateId]);

  return (
    <div className={style.container}>
      <h1 className={style.bigTitle}>정보수정</h1>
      <EstateUpdate1 realEstate={realEstate} setRealEstate={setRealEstate} />
      <EstateUpdate2 realEstate={realEstate} setRealEstate={setRealEstate} setOptionList={setOptionList} maintenanceOption={maintenanceOption} setMaintenanceOption={setMaintenanceOption} />
      <EstateUpdate3 realEstate={realEstate} setRealEstate={setRealEstate} estateImages={estateImages} setEstateImages={setEstateImages} />
      <div className={style.buttonDiv}>
        <button onClick={handleReturn}>이전으로</button>
        <button onClick={handleSubmit}>다음으로</button>
      </div>
    </div>
  );
}

export default EstateUpdate;
