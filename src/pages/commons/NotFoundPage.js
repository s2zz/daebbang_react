import React from 'react';
import style from "../commons/NotFoundPage.module.css";
import { Link } from 'react-router-dom';
function NotFoundPage() {

  return (
    <div className={style.container}>
      <div className="icon">
        <img src="/UI_img/notfound.png" alt="Not Found" />
      </div>
      <div className={style.text}>
        <div className="text_top">
          <div>페이지를 찾을 수 없습니다.</div>
          <div>(404 Not Found)</div>
        </div>
        <div className={style.text_bottom}>
          <div>페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</div>
          <div>입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.</div>
        </div>
      </div>
      <div className={style.btns}>
      <Link to="/"><button>홈으로가기</button></Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
