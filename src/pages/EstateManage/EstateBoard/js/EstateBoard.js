import { useState, useEffect } from "react";
import axios from "axios";

function EstateBoard() {
  const [realEstate, setRealEstate] = useState([]);

  useEffect(() => {
    axios.get("/api/estateManage/").then((resp) => {
      setRealEstate(resp.data);
    });
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {realEstate.map((estate, index) => (
            <tr key={index}>
              <td>{estate.estateId}</td>
              <td>{estate.roomType} {estate.transactionType} {estate.deposit}/{estate.price}</td>
              <td>{estate.title}</td>
              <td>{estate.contents}</td>
              <td> <button>수정</button> <button>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EstateBoard;
