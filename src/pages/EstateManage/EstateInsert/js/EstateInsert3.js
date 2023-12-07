import { useState } from "react";
import axios from "axios";
import style from '../css/EstateInsert.module.css';
import { useNavigate } from "react-router-dom";

function EstateInsert3() {
  const navi = useNavigate();

  // 보낼 데이터
  const [realEstate, setRealEstate] = useState({
    title: "",
    contents: "",
    memo: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRealEstate(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = () => {
    console.log(realEstate);
    axios.post("/api/estateManage/estateInsert3", realEstate).then(resp => {
      console.log(resp);
      navi("../../");
    }).catch(e => {

    });
  }

  return (
    <div className="container">
      <h1 className={style.title}>사진 등록</h1>
      <table border={1}>
        <tr>
          <th>일반 사진<span>*</span></th>
          <td>
            <input type="file"></input>
          </td>
        </tr>
      </table>
      <h1 className={style.title} >상세 설명</h1>
      <table border={1}>
        <tr>
          <th>제목<span>*</span></th>
          <td>
            <input type="text" placeholder="제목을 입력해주세요." name="title" onChange={handleChange}></input>
          </td>
        </tr>
        <tr>
          <th>상세설명<span>*</span></th>
          <td>
            <textarea placeholder="설명을 입력해주세요." name="contents" onChange={handleChange}></textarea>
          </td>
        </tr>
        <tr>
          <th>메모</th>
          <td>
            <textarea placeholder="메모는 본인에게만 보입니다." name="memo" onChange={handleChange}></textarea>
          </td>
        </tr>
      </table>

      <button onClick={handleSubmit}>다음으로</button>
    </div>
  );
}

export default EstateInsert3;
