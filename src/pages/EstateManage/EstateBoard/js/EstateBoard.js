import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function EstateBoard() {
  const [realEstate, setRealEstate] = useState([]);

  useEffect(() => {
    axios.get("/api/estateManage/").then((resp) => {
      console.log(resp.data);
      setRealEstate(resp.data);
    });
  }, []);

  const handleDelete = (estateId) => {
    const result = window.confirm("정말 삭제하시겠습니까?");

    if (result) {
      axios.delete(`/api/estateManage/${estateId}`).then(() => {
        const updatedRealEstate = realEstate.filter(
          (estate) => estate.estateId !== estateId
        );
        setRealEstate(updatedRealEstate);
      });
    } else {
      return false;
    }

  }

  return (
    <div className="container">
      <table border={1}>
        <thead>
          <tr>
            <th colSpan={3}>Message List</th>
          </tr>
          <tr>
            <th>매물번호</th>
            <th>정보</th>
            <th>제목</th>
            <th>설명</th>
            <th> </th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {realEstate.map((estate, index) => (
            <tr key={index}>
              <td>{estate.estateId}</td>
              <td>{estate.roomType} {estate.transactionType} {estate.deposit}/{estate.price}</td>
              <td>{estate.title}</td>
              <td>{estate.contents}</td>
              <td>{estate.writer} 위도{estate.latitude} 경도{estate.longitude}</td>
              <td>
                <Link to={`/estateManage/estateUpdate/${estate.estateId}`}><button>수정</button></Link>
                <button onClick={() => handleDelete(estate.estateId)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EstateBoard;
