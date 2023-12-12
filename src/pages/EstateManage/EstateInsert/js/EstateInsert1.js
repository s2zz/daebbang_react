import { useState } from "react";
import axios from "axios";
import Post from '../../js/Post';
import style from '../css/EstateInsert.module.css';
import { useNavigate } from "react-router-dom";

function EstateInsert1() {
  const navi = useNavigate();

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
    address: ''
  });

  // 주소 검색 팝업
  const [popup, setPopup] = useState(false);

  const handleAddress = async (e) => {
    const { name, value } = e.target;

    if (name === 'address') {
      setEnroll_company({
        ...enroll_company,
        [name]: value,
      });

      // 좌표 변환
      try {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const result = await new Promise((resolve, reject) => {
          geocoder.addressSearch(value, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              resolve({
                latitude: result[0].y,
                longitude: result[0].x,
              });
            } else {
              reject(status);
            }
          });
        });

        setRealEstate(prev => ({
          ...prev,
          latitude: result.latitude,
          longitude: result.longitude,
        }));
      } catch (error) {
        console.error("Error converting address to coordinates:", error);
      }
      // 좌표 변환
    }
  };


  // 주소 검색 팝업창 닫기
  const handleComplete = (data) => {
    setPopup(!popup);
  }

  // 보낼 데이터
  const [realEstate, setRealEstate] = useState({
    roomCode: "",
    structureCode: "",
    buildingCode: "",
    heatingCode: "",
    area: "",
    zipcode: "",
    address: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 숫자 또는 소수점 이외의 문자는 제거
    const sanitizedValue = value.replace(/[^0-9.]/g, "");

    handleAreaChange(e);
    handleAddress(e);

    setRealEstate(prev => ({ ...prev, zipcode: enroll_company.zipcode, address: enroll_company.address }));

    if (name === 'area') {
      setRealEstate(prev => ({ ...prev, [name]: sanitizedValue }));
    } else {
      setRealEstate(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = () => {
    
    if (Object.values(realEstate).some(e => !e)) {
      alert("모든 항목을 입력해주세요");
      return false;
    }

    axios.post("/api/estateManage/estateInsert1", realEstate).then(resp => {
      console.log(resp);
      navi("../estateInsert2");
    }).catch(e => {

    });
  }

  return (
    <div className="container">
      <h1 className={style.title}>매물 정보</h1>
      <table border="1">
        <tr>
          <th>종류 선택<span>*</span></th>
          <td>
            <input type="radio" id="r1" name="roomCode" value="r1" onChange={handleChange} /><label for="r1">원룸</label>
            <input type="radio" id="r2" name="roomCode" value="r2" onChange={handleChange} /><label for="r2">투룸</label>
          </td>
        </tr>
        <tr>
          <th>구조 선택<span>*</span></th>
          <td>
            <input type="radio" id="s1" name="structureCode" value="s1" onChange={handleChange} /><label for="s1">오픈형 원룸</label>
            <input type="radio" id="s2" name="structureCode" value="s2" onChange={handleChange} /><label for="s2">분리형 원룸</label>
            <input type="radio" id="s3" name="structureCode" value="s3" onChange={handleChange} /><label for="s3">복층형 원룸</label>
          </td>
        </tr>
        <tr>
          <th>건물 유형<span>*</span></th>
          <td>
            <input type="radio" id="b1" name="buildingCode" value="b1" onChange={handleChange} /><label for="b1">단독주택</label>
            <input type="radio" id="b2" name="buildingCode" value="b2" onChange={handleChange} /><label for="b2">다가구주택</label>
            <input type="radio" id="b3" name="buildingCode" value="b3" onChange={handleChange} /><label for="b3">빌라/연립/다세대</label>
            <input type="radio" id="b4" name="buildingCode" value="b4" onChange={handleChange} /><label for="b4">상가주택</label>
          </td>
        </tr>
        <tr>
          <th>주소<span>*</span></th>
          <td>
            <div>
              <div>
                <input type="text" placeholder="우편번호" name="zipcode" onChange={handleChange} value={enroll_company.zipcode} /><button onClick={handleComplete}>우편번호 찾기</button>
              </div>
              <div>
                <input type="text" placeholder="주소" name="address" onChange={handleChange} value={enroll_company.address} />
              </div>
              {popup && <Post company={enroll_company} setcompany={setEnroll_company}></Post>}
            </div>
          </td>
        </tr>
        <tr>
          <th>매물크기<span>*</span></th>
          <td>
            <div>전용면적</div>
            <div className={style.ScaleDiv}>
              <input type="text" pattern="[0-9]*\.?[0-9]*" name="area" onChange={handleChange} value={realEstate.area} />
              <p className={style.Scale}>평</p>
            </div>
            =
            <div className={style.ScaleDiv}>
              <input type="text" value={areas.squareMeter} readOnly />
              <p className={style.Scale}>㎡</p>
            </div>
          </td>
        </tr>
        <tr>
          <th>난방 종류<span>*</span></th>
          <td>
            <input type="radio" id="h1" name="heatingCode" value="h1" onChange={handleChange} /><label for="h1">개별난방</label>
            <input type="radio" id="h2" name="heatingCode" value="h2" onChange={handleChange} /><label for="h2">중앙난방</label>
          </td>
        </tr>
      </table>
      <button onClick={handleSubmit}>다음으로</button>
    </div>
  );
}

export default EstateInsert1;
