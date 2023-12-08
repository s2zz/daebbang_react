import { useState } from "react";
import axios from "axios";
import style from '../css/EstateInsert.module.css';
import { useNavigate } from "react-router-dom";

function EstateInsert2() {
  const navi = useNavigate();

  // 관리비 유무
  const [maintenanceOption, setMaintenanceOption] = useState("true");

  const handleMaintenanceChange = (e) => {
    setMaintenanceOption(e.target.value);

    console.log(maintenanceOption);

    if (maintenanceOption === "true") {
      realEstate.maintenanceCost = "";
    }
  }

  // 보낼 데이터
  const [realEstate, setRealEstate] = useState({
    transactionCode: "t1",
    deposit: "",
    price: "",
    maintenanceCost: "",
    roomFloors: "",
    buildingFloors: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 숫자 또는 소수점 이외의 문자는 제거
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    if (name === 'transactionCode') {
      setRealEstate(prev => ({ ...prev, [name]: value }));
    } else {
      setRealEstate(prev => ({ ...prev, [name]: sanitizedValue }));
    }

  }

  // 옵션 리스트
  const [optionList, setOptionList] = useState([]);

  // 옵션 리스트
  const handleOptionCode = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setOptionList((prev) => [...prev, value]);
    } else {
      setOptionList((prev) => prev.filter((option) => option !== value));
    }
  };

  const handleSubmit = () => {
    axios.post("/api/estateManage/estateInsert2", { estateDTO: realEstate, optionList: optionList }).then(resp => {
      console.log(resp);
      navi("../estateInsert3");
    }).catch(e => {

    });
  }

  return (
    <div className="container">
      <h1 className={style.title}>거래 정보</h1>
      <table border="1">
        <tr>
          <th>거래 종류<span>*</span></th>
          <td>
            <input type="radio" id="t1" name="transactionCode" value="t1" onChange={handleChange} checked={realEstate.transactionCode === "t1"} /><label for="t1">월세</label>
            <input type="radio" id="t2" name="transactionCode" value="t2" onChange={handleChange} checked={realEstate.transactionCode === "t2"} /><label for="t2">전세</label>
            {realEstate.transactionCode === 't1' && <span><input type="checkbox" id="o1" name="optionCode" value="o1" onChange={handleOptionCode} /><label for="o1">단기가능</label></span>}

          </td>
        </tr>
        <tr>
          <th>가격 정보<span>*</span></th>
          <td>
            <div>보증금</div>
            <div className={style.ScaleDiv}>
              <input type="text" name="deposit" onChange={handleChange} value={realEstate.deposit} />
              <p className={style.Scale}>만원</p>
            </div>
            <div>{realEstate.transactionCode === 't1' ? "월세" : "전세"}</div>
            <div className={style.ScaleDiv}>
              <input type="text" name="price" onChange={handleChange} value={realEstate.price} />
              <p className={style.Scale}>만원</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>공용관리비<span>*</span></th>
          <td>
            <div>관리비</div>
            <div className={style.ScaleDiv}>
              <input type="radio" id="m1" name="maintenanceOption" value="false" onChange={handleMaintenanceChange} checked={maintenanceOption === "false"} /><label for="m1">없음</label>
              <input type="radio" id="m2" name="maintenanceOption" value="true" onChange={handleMaintenanceChange} checked={maintenanceOption === "true"} /><label for="m2">있음</label>
              <input type="text" name="maintenanceCost" readOnly={maintenanceOption === "false"} onChange={handleChange} value={realEstate.maintenanceCost} />
              <p className={style.Scale}>원</p>
            </div>
          </td>
        </tr>
      </table>



      <h1 className={style.title}>추가 정보</h1>
      <table border="1">
        <tr>
          <th>층수<span>*</span></th>
          <td>
            <div>
              전체 층 수
              <input type="text" name="buildingFloors" onChange={handleChange} value={realEstate.buildingFloors} />
            </div>
            <div>
              해당 층 수
              <input type="text" name="roomFloors" onChange={handleChange} value={realEstate.roomFloors} />
            </div>
          </td>
        </tr>
        <tr>
          <th>옵션항목</th>
          <td>
            <input type="checkbox" id="o2" name="optionCode" value="o2" onChange={handleOptionCode} /><label for="o2">주차장</label>
            <input type="checkbox" id="o3" name="optionCode" value="o3" onChange={handleOptionCode} /><label for="o3">엘리베이터</label>
            {/* <input type="checkbox" /><label>반려동물</label>
            <input type="checkbox" /><label>베란다/발코니</label>
            <input type="checkbox" /><label>에어컨</label>
            <input type="checkbox" /><label>세탁기</label>
            <input type="checkbox" /><label>침대</label>
            <input type="checkbox" /><label>책상</label>
            <input type="checkbox" /><label>옷장</label>
            <input type="checkbox" /><label>TV</label>
            <input type="checkbox" /><label>신발장</label>
            <input type="checkbox" /><label>냉장고</label>
            <input type="checkbox" /><label>가스레인지</label>
            <input type="checkbox" /><label>인덕션</label>
            <input type="checkbox" /><label>전자레인지</label>
            <input type="checkbox" /><label>전자도어락</label>
            <input type="checkbox" /><label>비데</label> */}
          </td>
        </tr>
      </table>
      <button onClick={handleSubmit}>다음으로</button>
    </div>
  );
}

export default EstateInsert2;
