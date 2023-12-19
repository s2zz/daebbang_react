import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import style from '../css/ReviewApproval.module.css';
import Pagination from "@mui/material/Pagination";

function ReviewApproval() {
  const [reviewApproval, setReviewApproval] = useState([]);

  useEffect(() => {
    axios.get(`/api/reviewApproval/agentReview/${sessionStorage.getItem('loginId')}`)
      .then((resp) => {
        console.log(resp.data);
        setReviewApproval(resp.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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
    return <Pagination count={Math.ceil(reviewApproval.length / countPerPage)} page={currentPage} onChange={currentPageHandle} />;
  }

  const contentslist = () => {
    const slicedReviewApproval = sliceContentsList(reviewApproval);

    if (slicedReviewApproval.length === 0) {
      return (
        <tr>
          <td colSpan="5">No data available</td>
        </tr>
      );
    } else {
      return slicedReviewApproval.map(boardItem);
    }


  };

  const boardItem = (item, i) => {
    const handleApproval = () => {
      const updatedReviewApproval = [...reviewApproval];
      if (item.approvalCode === 'a1') {
        updatedReviewApproval[i] = { ...item, approvalCode: 'a2' };
      } else {
        updatedReviewApproval[i] = { ...item, approvalCode: 'a1' };
      }

      setReviewApproval(updatedReviewApproval);

      axios.put(`/api/reviewApproval/updateStatus/${item.seq}`, { approvalCode: updatedReviewApproval[i].approvalCode })
        .then(resp => {
          console.log(resp);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    };

    const handleCancel = () => {
      const updatedReviewApproval = [...reviewApproval];

      if (item.approvalCode === 'a4') {
        updatedReviewApproval[i] = { ...item, approvalCode: 'a1' };
      } else {
        updatedReviewApproval[i] = { ...item, approvalCode: 'a4' };
      }

      setReviewApproval(updatedReviewApproval);

      axios.put(`/api/reviewApproval/updateStatus/${item.seq}`, { approvalCode: updatedReviewApproval[i].approvalCode })
        .then(resp => {
          console.log(resp);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    };

    return (
      <tr key={i}>
        <td>{item.seq}</td>
        <td>{item.userId}</td>
        <td><Link to={`/estateManage/estateInfo/${item.estateCode}`}>{item.estateCode}</Link></td>
        <td>{item.approvalCode}</td>
        <td>
          <button onClick={handleApproval}>리뷰 권한 부여</button>
          <button onClick={handleCancel}>취소</button>
        </td>
      </tr>
    );
  }

  return (
    <div className={style.container}>
      <table className={style.estateTable}>
        <thead>
          <tr>
            <th>번호</th>
            <th>신청인</th>
            <th>매물번호</th>
            <th>권한</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {contentslist()}
        </tbody>
      </table>

      <div className={style.naviFooter}>
        {pagenation()}
      </div>
    </div>
  );
}

export default ReviewApproval;
