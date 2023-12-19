import style from '../css/EstateInfo.module.css';

function EstateInfo2({ realEstate }) {

  const hasOption = (optionCode) => {
    return realEstate.optionList.some(option => option.optionCode === optionCode);
  };

  const renderAllOptionTitles = () => {
    return realEstate.optionList.map(option => (
      <span key={option.optionCode}>{option.optionTitle.optionName}</span> 
    ));
  };

  return (
    <>
      <div className={style.titleDiv}>
        <h1 className={style.title}>거래 정보</h1>
      </div>
      <table>
        <tr>
          <th>거래 종류</th>
          <td>
            {realEstate.transaction.transactionType}  {hasOption('o1') ? "단기임대" : ""}
          </td>
        </tr>
        <tr>
          <th>가격 정보</th>
          <td className={style.flexTd}>
            <div>
              <div>
                보증금 {realEstate.deposit}만원
              </div>
              <div>
                {realEstate.transaction.transactionType} {realEstate.price} 만원
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>공용관리비</th>
          <td>
            <div>관리비 {realEstate.maintenanceCost}원</div>
          </td>
        </tr>
      </table>

      <div className={style.titleDiv}>
        <h1 className={style.title}>추가 정보</h1>
      </div>
      <table>
        <tr>
          <th>층수</th>
          <td>
            <div>
              <label>전체 층 수</label>
              {realEstate.buildingFloors}
            </div>
            <div>
              <label>해당 층 수</label>
              {realEstate.roomFloors}
            </div>
          </td>
        </tr>
        <tr>
          <th>옵션항목</th>
          <td>
          {realEstate.optionList.length > 0 ? renderAllOptionTitles() : "옵션 없음"}
          </td>
        </tr>
      </table>
    </>
  );
}

export default EstateInfo2;
