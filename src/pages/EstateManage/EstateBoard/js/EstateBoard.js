import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import style from '../css/EstateBoard.module.css';
import Pagination from "@mui/material/Pagination";

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

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const countPerPage = 10;
  const sliceContentsList = () => {
      const start = (currentPage - 1) * countPerPage;
      const end = start + countPerPage;
      return realEstate.slice(start, end);
  }
  const currentPageHandle = (event, currentPage) => {
      setCurrentPage(currentPage);
  }

  return (
    <div className={style.container}>
      <table className={style.estateTable}>
        <thead>
          <tr>
            <th></th>
            <th>보증금/월세(전세)</th>
            <th>제목</th>
            <th>설명</th>
            <th>위치</th>
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {realEstate.map((estate, index) => (
            <tr key={index}>
              <td><img src={`uploads\\estateImages\\${estate.images[0].sysName}`} alt="Estate Image"></img></td>
              <td>{estate.roomType} {estate.transactionType} {estate.deposit}/{estate.price}</td>
              <td>{estate.title}</td>
              <td>{estate.contents}</td>
              <td>{estate.address1}</td>
              <td>
                <Link to={`/estateManage/estateUpdate/${estate.estateId}`}><button>수정</button></Link>
                <button onClick={() => handleDelete(estate.estateId)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={style.naviFooter}>
        {
            <Pagination count={Math.ceil(realEstate.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />
        }
      </div>
      <Link to={`/estateManage/estateInsert`}><button>방 내놓기</button></Link>
    </div>
  );
}

export default EstateBoard;
