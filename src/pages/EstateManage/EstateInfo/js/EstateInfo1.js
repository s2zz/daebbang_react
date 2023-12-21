import style from '../css/EstateInfo.module.css';

function EstateInfo1({ realEstate }) {

  return (
    <>
      <div className={style.titleDiv}>
        <h1 className={style.title}>매물 정보</h1>
      </div>
      <table className={style.estateTable}>
        <tr>
          <th>종류</th>
          <td>
            {realEstate.room.roomType}
          </td>
        </tr>
        <tr>
          <th>구조 </th>
          <td>
            {realEstate.structure.structureType}
          </td>
        </tr>
        <tr>
          <th>건물 유형</th>
          <td>
            {realEstate.building.buildingType}
          </td>
        </tr>
        <tr>
          <th>주소</th>
          <td>
            <div>
              <div>
                {realEstate.zipcode}
              </div>
              <div>
                {realEstate.address1}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>매물크기</th>
          <td>
            <div>전용면적</div>
            <span className={style.infoSpan}>
              {realEstate.area}평
            </span>
            <span className={style.infoSpan}>
            =
            </span>
            <span className={style.infoSpan}>
              {realEstate.area * 3.30578.toFixed(2)}㎡
            </span>
          </td>
        </tr>
        <tr>
          <th>난방 종류</th>
          <td>
            {realEstate.heatingSystem.heatingType}
          </td>
        </tr>
      </table>
    </>
  );
}

export default EstateInfo1;