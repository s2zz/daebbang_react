import { useState, useEffect } from "react";
import axios from "axios";
import style from '../css/EstateInsert.module.css';
import { useNavigate, useParams } from "react-router-dom";
import EstateInfo1 from './EstateInfo1';
import EstateInfo2 from './EstateInfo2';
import EstateInfo3 from './EstateInfo3';

function EstateInsert() {
  const navi = useNavigate();
  const { estateId } = useParams();

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
    navi("/EstateManage/reviewApproval");
  }

  useEffect(() => {
    axios.get(`/api/estateManage/estateInfo/${estateId}`)
      .then(resp => {
        console.log("Fetched data:", resp.data);

        setRealEstate(resp.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, [estateId]);

  const Loading = realEstate.title !== "";;

  return (
    <>
      <h1 className={style.bigTitle}>매물 정보</h1>
      {Loading ? (
        <>
          <EstateInfo1 realEstate={realEstate} />
          <EstateInfo2 realEstate={realEstate} />
          <EstateInfo3 realEstate={realEstate} />
          <div className={style.buttonDiv}>
            <button onClick={handleReturn}>이전으로</button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}

export default EstateInsert;
