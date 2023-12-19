import { useEffect, useState } from "react";
import Post from '../../js/Post';
import style from '../css/EstateUpdate.module.css';

function EstateUpdate1({ realEstate, setRealEstate }) {
  const { kakao } = window;
  const [isLoading, setIsLoading] = useState(true);

  // 평수&제곱미터
  const [areas, setAreas] = useState({ area: '', squareMeter: '' });

  // 평수, 제곱미터
  const handleAreaChange = (e) => {
    let { name, value } = e.target;

    // 입력한 값이 평수일 떄
    if (name === 'area') {
      // 숫자가 아닌 값이 입력되었을 때
      if (isNaN(value)) {
        value = 0;
      }

      // 제곱미터 계산
      const pyeongValue = parseFloat(value);
      const squareMeterValue = pyeongValue * 3.30578; // 1평 = 3.30578㎡

      setRealEstate(prev => ({ ...prev, [name]: value }));
      setAreas({ area: value, squareMeter: squareMeterValue.toFixed(2) });
    }
  }

  // 우편 번호
  const [enroll_company, setEnroll_company] = useState({
    zipcode: '',
    address1: '',
    address2: ''
  });

  // 주소 검색 팝업
  const [popup, setPopup] = useState(false);

  const handleAddress = async (e) => {
    const { name, value } = e.target;

    if (name === 'address1') {
      setEnroll_company({
        ...enroll_company,
        [name]: value
      });
    }
  };

  // 주소 검색 팝업창 열기/닫기
  const handleComplete = (data) => {
    setPopup(!popup);
  }

  // 좌표 입력
  const handleGeocoding = (address1) => {
    // 주소-좌표 변환 객체를 생성합니다
    const geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address1, function (result, status) {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 realEstate 객체에 자동 입력합니다
        setRealEstate(prevState => ({
          ...prevState,
          latitude: result[0].y,
          longitude: result[0].x
        }));

        // ... (마커, 인포윈도우 설정 등 이전 코드와 동일한 부분)
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 숫자 또는 소수점 이외의 문자는 제거
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    handleAreaChange(e);
    handleAddress(e);

    setRealEstate(prev => ({ ...prev, zipcode: enroll_company.zipcode, address1: enroll_company.address1, address2: enroll_company.address2 }));

    if (name === 'area') {
      setRealEstate(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setRealEstate(prev => ({ ...prev, [name]: value }));
    }

    // 주소가 입력되었을 때 주소를 이용해 좌표 검색 및 realEstate 업데이트
    if (realEstate.address1) {
      handleGeocoding(realEstate.address1);
    }
  }

  useEffect(() => {
    setEnroll_company(prev => ({
      zipcode: realEstate.zipcode,
      address1: realEstate.address1,
      address2: realEstate.address2
    }));

    setAreas({ squareMeter: (realEstate.area * 3.30578).toFixed(2) });

    setIsLoading(false); // 로딩 상태 변경
  }, [realEstate.address1, enroll_company.address1]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className={style.titleDiv}>
            <h1 className={style.title}>매물 정보</h1>
            <p><span className={style.star}>*</span> 필수입력 항목</p>
          </div>
          <table>
            <tr>
              <th>종류 선택<span className={style.star}>*</span></th>
              <td>
                <input type="radio" id="r1" name="roomCode" value="r1" onChange={handleChange} checked={realEstate.roomCode === "r1"} /><label for="r1">원룸</label>
                <input type="radio" id="r2" name="roomCode" value="r2" onChange={handleChange} checked={realEstate.roomCode === "r2"} /><label for="r2">투룸</label>
              </td>
            </tr>
            <tr>
              <th>구조 선택<span className={style.star}>*</span></th>
              <td>
                <input type="radio" id="s1" name="structureCode" value="s1" onChange={handleChange} checked={realEstate.structureCode === "s1"} /><label for="s1">오픈형 원룸</label>
                <input type="radio" id="s2" name="structureCode" value="s2" onChange={handleChange} checked={realEstate.structureCode === "s2"} /><label for="s2">분리형 원룸</label>
                <input type="radio" id="s3" name="structureCode" value="s3" onChange={handleChange} checked={realEstate.structureCode === "s3"} /><label for="s3">복층형 원룸</label>
              </td>
            </tr>
            <tr>
              <th>건물 유형<span className={style.star}>*</span></th>
              <td>
                <input type="radio" id="b1" name="buildingCode" value="b1" onChange={handleChange} checked={realEstate.buildingCode === "b1"} /><label for="b1">단독주택</label>
                <input type="radio" id="b2" name="buildingCode" value="b2" onChange={handleChange} checked={realEstate.buildingCode === "b2"} /><label for="b2">다가구주택</label>
                <input type="radio" id="b3" name="buildingCode" value="b3" onChange={handleChange} checked={realEstate.buildingCode === "b3"} /><label for="b3">빌라/연립/다세대</label>
                <input type="radio" id="b4" name="buildingCode" value="b4" onChange={handleChange} checked={realEstate.buildingCode === "b4"} /><label for="b4">상가주택</label>
              </td>
            </tr>
            <tr>
              <th>주소<span className={style.star}>*</span></th>
              <td>
                <div>
                  <div>
                    <input type="text" placeholder="우편번호" name="zipcode" onChange={handleChange} value={enroll_company.zipcode} readOnly />
                  </div>
                  <div>
                    <input type="text" placeholder="주소" name="address1" onChange={handleChange} value={enroll_company.address1} readOnly />
                  </div>
                  {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}
                </div>
              </td>
            </tr>
            <tr>
              <th>매물크기<span className={style.star}>*</span></th>
              <td>
                <div>전용면적</div>
                <div className={style.scaleDiv}>
                  <input type="text" pattern="[0-9]*\.?[0-9]*" className={style.scaleInput} name="area" onChange={handleChange} value={realEstate.area} />
                  <p className={style.scale}>평</p>
                </div>
                =
                <div className={style.scaleDiv}>
                  <input type="text" className={style.scaleInput} value={areas.squareMeter} readOnly />
                  <p className={style.scale}>㎡</p>
                </div>
              </td>
            </tr>
            <tr>
              <th>난방 종류<span className={style.star}>*</span></th>
              <td>
                <input type="radio" id="h1" name="heatingCode" value="h1" onChange={handleChange} checked={realEstate.heatingCode === "h1"} /><label for="h1">개별난방</label>
                <input type="radio" id="h2" name="heatingCode" value="h2" onChange={handleChange} checked={realEstate.heatingCode === "h2"} /><label for="h2">중앙난방</label>
              </td>
            </tr>
          </table>
        </>
      )}
    </>

  );
}

export default EstateUpdate1;