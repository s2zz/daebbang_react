import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import style from '../css/EstateBoard.module.css';
import Pagination from "@mui/material/Pagination";

function EstateBoard() {
  const [realEstate, setRealEstate] = useState([]);

  useEffect(() => {
    axios.get("/api/estateManage/estateBoard", {
      params: {
        loginId: sessionStorage.getItem('loginId') // 쿼리 파라미터로 데이터 전송
      }
    })
      .then((resp) => {
        console.log(resp.data);
        setRealEstate(resp.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
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

  const [currentPage, setCurrentPage] = useState(1);
  const countPerPage = 10;
  const sliceContentsList = (list) => {
    const start = (currentPage - 1) * countPerPage;
    const end = start + countPerPage;
    return list.slice(start, end);
  }
  const currentPageHandle = (event, currentPage) => {
    setCurrentPage(currentPage);
  }

  const pagenation = () => {
    return <Pagination count={Math.ceil(realEstate.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />;
  }

  const contentslist = () => {
    return sliceContentsList(realEstate).map(boardItem);
  }

  const boardItem = (estate, i) => {
    return (
      <tr key={i}>
        {<td><img src={`uploads\\estateImages\\${estate.images[0].sysName}`} alt="Estate Image"></img></td>}
        <td>{estate.roomType} {estate.transactionType} {estate.deposit}/{estate.price}</td>
        <td>{estate.title}</td>
        <td>{estate.contents}</td>
        <td>{estate.address1}</td>
        <td>
          <Link to={`/estateManage/estateUpdate/${estate.estateId}`}><button>수정</button></Link>
          <button onClick={() => handleDelete(estate.estateId)}>삭제</button>
        </td>
      </tr>
    );
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
          {contentslist()}
        </tbody>
      </table>
  
      <div className={style.naviFooter}>
        {pagenation()}
      </div>
      <Link to={`/estateManage/estateInsert`}><button>방 내놓기</button></Link>
    </div>
  );
}



export default EstateBoard;
