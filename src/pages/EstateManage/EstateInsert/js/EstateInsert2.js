import style from '../css/EstateInsert.module.css';

function EstateInsert2({ realEstate, setRealEstate, setOptionList, maintenanceOption, setMaintenanceOption }) {

  const handleMaintenanceChange = (e) => {
    setMaintenanceOption(e.target.value);

    if (maintenanceOption === "true") {
      realEstate.maintenanceCost = "";
    }
  }

  // 옵션 리스트
  const handleOptionCode = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setOptionList((prev) => [...prev, value]);
    } else {
      setOptionList((prev) => prev.filter((option) => option !== value));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 숫자 이외의 문자는 제거
    const sanitizedValue = value.replace(/[^0-9]/g, "");

    if (name === 'transactionCode') {
      setRealEstate(prev => ({ ...prev, [name]: value }));
    } else {
      setRealEstate(prev => ({ ...prev, [name]: sanitizedValue }));
    }
  }

  return (
    <>
      <div className={style.titleDiv}>
        <h1 className={style.title}>거래 정보</h1>
        <p><span className={style.star}>*</span> 필수입력 항목</p>
      </div>
      <table>
        <tr>
          <th>거래 종류<span className={style.star}>*</span></th>
          <td>
            <input type="radio" id="t1" name="transactionCode" value="t1" onChange={handleChange} checked={realEstate.transactionCode === "t1"} /><label for="t1">월세</label>
            <input type="radio" id="t2" name="transactionCode" value="t2" onChange={handleChange} checked={realEstate.transactionCode === "t2"} /><label for="t2">전세</label>
            {realEstate.transactionCode === 't1' && <span><input type="checkbox" id="o1" name="optionCode" value="o1" onChange={handleOptionCode} /><label for="o1">단기가능</label></span>}
          </td>
        </tr>
        <tr>
          <th>가격 정보<span className={style.star}>*</span></th>
          <td className={style.flexTd}>
            <div>
              <div>보증금</div>
              <div className={style.scaleDiv}>
                <input type="text" className={style.scaleInput} name="deposit" onChange={handleChange} value={realEstate.deposit} />
                <p className={style.scale}>만원</p>
              </div>
            </div>
            <div>
              <div>{realEstate.transactionCode === 't1' ? "월세" : "전세"}</div>
              <div className={style.scaleDiv}>
                <input type="text" className={style.scaleInput} name="price" onChange={handleChange} value={realEstate.price} />
                <p className={style.scale}>만원</p>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>공용관리비<span className={style.star}>*</span></th>
          <td>
            <div>관리비</div>
            <div className={style.scaleDiv}>
              <input type="radio" id="m1" name="maintenanceOption" value="false" onChange={handleMaintenanceChange} checked={maintenanceOption === "false"} /><label for="m1">없음</label>
              <input type="radio" id="m2" name="maintenanceOption" value="true" onChange={handleMaintenanceChange} checked={maintenanceOption === "true"} /><label for="m2">있음</label>
              <input type="text" className={style.scaleInput} name="maintenanceCost" readOnly={maintenanceOption === "false"} onChange={handleChange} value={realEstate.maintenanceCost} />
              <p className={style.scale}>원</p>
            </div>
          </td>
        </tr>
      </table>

      <div className={style.titleDiv}>
        <h1 className={style.title}>추가 정보</h1>
        <p><span className={style.star}>*</span> 필수입력 항목</p>
      </div>
      <table>
        <tr>
          <th>층수<span className={style.star}>*</span></th>
          <td>
            <div>
              <label>전체 층 수</label>
              <input type="text" name="buildingFloors" onChange={handleChange} value={realEstate.buildingFloors} />
            </div>
            <div>
              <label>해당 층 수</label>
              <input type="text" name="roomFloors" onChange={handleChange} value={realEstate.roomFloors} />
            </div>
          </td>
        </tr>
        <tr>
          <th>옵션항목</th>
          <td>
            <input type="checkbox" id="o2" name="optionCode" value="o2" onChange={handleOptionCode} /><label for="o2">주차장</label>
            <input type="checkbox" id="o3" name="optionCode" value="o3" onChange={handleOptionCode} /><label for="o3">엘리베이터</label>
            <input type="checkbox" id="o4" name="optionCode" value="o4" onChange={handleOptionCode} /><label for="o4">에어컨</label>
            <input type="checkbox" id="o5" name="optionCode" value="o5" onChange={handleOptionCode} /><label for="o5">세탁기</label>
            <input type="checkbox" id="o6" name="optionCode" value="o6" onChange={handleOptionCode} /><label for="o6">침대</label>
            <input type="checkbox" id="o7" name="optionCode" value="o7" onChange={handleOptionCode} /><label for="o7">책상</label>
            <input type="checkbox" id="o8" name="optionCode" value="o8" onChange={handleOptionCode} /><label for="o8">옷장</label>
            <input type="checkbox" id="o9" name="optionCode" value="o9" onChange={handleOptionCode} /><label for="o9">TV</label>
            {/* <input type="checkbox" /><label>반려동물</label>
            <input type="checkbox" /><label>베란다/발코니</label>
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
    </>
  );
}

export default EstateInsert2;
