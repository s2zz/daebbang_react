import { useState, useEffect } from "react";
import { Button } from 'reactstrap';
import axios from "axios";
import { Link } from "react-router-dom";
import style from '../css/EstateBoard.module.css';
import Pagination from "@mui/material/Pagination";
import Loading from '../../../commons/Loading';

function EstateBoard() {
  const [realEstate, setRealEstate] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/estateManage/estateBoard", {
      params: {
        loginId: sessionStorage.getItem('loginId') // 쿼리 파라미터로 데이터 전송
      }
    })
      .then((resp) => {
        console.log(resp.data);
        setRealEstate(resp.data);

        setLoading(false);
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

  const handleSales = (estateId) => {
    axios.put(`/api/estateManage/updateStatus/${estateId}`).then(() => {
      const updatedRealEstate = realEstate.map((estate) => {
        if (estate.estateId === estateId) {
          return {
            ...estate,
            soldStatus: !estate.soldStatus // 상태 반전
          };
        }
        return estate;
      });
      setRealEstate(updatedRealEstate);
    }).catch((error) => {
      console.error("Error updating status:", error);
    });
  };

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
        <td>
          {estate.images && estate.images.length > 0 ?
            (<img src={` https://storage.googleapis.com/daebbang/estateImages/${estate.images[0].sysName}`} alt="Estate Image" />) :
            (<>No Image</>)}
        </td>
        <td>{estate.roomType} {estate.transactionType} {estate.deposit}/{estate.price}</td>
        <td><Link to={`/estateManage/estateInfo/${estate.estateId}`} className={style.infoLink}>{estate.title}</Link></td>
        <td>{estate.address1}</td>
        <td>{estate.memo}</td>
        <td>
          <Link to={`/estateManage/estateUpdate/${estate.estateId}`}><Button className={style.updateBtn}>수정</Button></Link>
          {estate.soldStatus ? <Button color="danger" className={style.updateBtn} onClick={() => handleSales(estate.estateId)}>판매완료</Button> :
            <Button color="primary" className={style.updateBtn} onClick={() => handleSales(estate.estateId)}>판매중</Button>}
          <Button color="danger" onClick={() => handleDelete(estate.estateId)}>삭제</Button>
        </td>
      </tr>
    );
  }

  return (
    <>
      <h1 className={style.bigTitle}>매물 관리</h1>
      {loading ? <Loading></Loading> : (
        <>
          <table className={style.estateTable}>
            <thead>
              <tr>
                <th>대표 이미지</th>
                <th>보증금/월세(전세)</th>
                <th>제목</th>
                <th>위치</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {contentslist()}
            </tbody>
          </table>

          <div className={style.naviFooter}>
            {pagenation()}
          </div>
        </>)}
    </>
  );
}



export default EstateBoard;
