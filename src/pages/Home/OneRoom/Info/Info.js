//
import { useState, useEffect, useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";


//
import style from "./Info.module.css";

//
function Info() {
  const info_scroll = useRef(null);
  const location = useLocation();
  const markerInfo = location.state;

  const { kakao } = window;

  // 임시로 일단 지도 그냥 뻘하니 떠있는거 좀 그래서 임시로 박아둠
  // 위치는 한기대임
  useEffect(()=>{
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(36.84142696925057, 127.14542099214732),
      level: 3
    };
    var map = new kakao.maps.Map(container, options);
    }, [])

  // 돌아가기 버튼 이벤트
  const back = function(){
      window.history.back();
  }

  // 스크롤 감지 이벤트
  const handleScroll = () => {

    // info_scroll의 속성 중 scrollTop(탑)을 나타냄
    const scrollTop = info_scroll.current.scrollTop;

    // 만약 탑이 0이라면을 가지고 조건문을 검
    if (scrollTop === 0) {
      console.log('최상단입니다.');
    } else {
      console.log('현재 최상단이 아닌 곳입니다.');      
    }
  };

  {/* box_2 더보기 클릭 시 나타남 ( 미구현 )  // 함수 적용 필요 display:none*/}

  const closeDiv = function(div,on){

    if(div == 'more'){
      if(on == 1){
        console.log('aaa');
      }
      else{
        console.log('abbb');
      }
    }
    else{
      console.log('aaaa');
    }

  }

  return (
    <div 
    ref={info_scroll}
    className={style.info_main}
    onScroll={() => handleScroll(info_scroll.current)}
    >
    {/* 정보 표기 구역*/}

      <div>

        {/* 드래그 이벤트에 의한 최상단 박스 (구현 못함 현재 display:none 상태임)*/}
        <div className={style.address_box}>
          <div onClick={() => back()}> {/* 뒤로가기 아이콘 넣을것 */}icon </div>
          {/*주소*/}{markerInfo.d}
        </div>
        {/* 드래그 이벤트에 의한 최상단 박스 끝*/}

        {/* 슬라이드 쇼*/}
        <div className={style.info_img} >
          <div onClick={() => back()}> {/* 뒤로가기 아이콘 넣을것 */} </div>
          {/* 슬라이드 알아서 넣을것 */}
        </div>

      {/* box_1 */}
        <div className={style.info_title}>
          <div className={style.info_title_top}>
            <div className={style.info_idx}>등록번호 {/*등록번호 넣기*/}38839957</div>
            <div className={style.info_day}>{/*몇일 전 넣기*/}12일 전</div>
          </div>

          <div className={style.info_address}>
            {/*주소*/}{markerInfo.d}
          </div>
          <div className={style.info_cost}>
            {/*월세*/}{markerInfo.b}
          </div>
          <div className={style.info_maintenance_cost}>
            {/*관리비*/} 관리비 15만원
          </div>
        </div>

      {/* box_2 */}
        <div className={style.info_subbox}>
          <div style={{margin:'10px 0 0 0'}}>사창사거리 인근</div>
          <div className={style.subbox_bold}><span>icon</span>전용 7평</div>
          <div className={style.subbox_bold}><span>icon</span>분리형원룸</div>
          <div><span>icon</span>주차가능</div>
          <div><span>icon</span>2층/4층</div>
          <div><span>icon</span>즉시 입주 가능</div>
          <div onClick={() => closeDiv('more',1)} className={style.more_info}>더보기</div> {/* 여기서 더보기 옆에서 > 뺌*/}
        </div>

        {/* box_2 더보기 클릭 시 나타남 ( 미구현 ) */}
        <div className={style.more_info_box}>
          <div className={style.more_info_box_top}>
            <div onClick={() => closeDiv('more')}> {/* 뒤로가기 아이콘 넣을것 */}X </div>
            매물 정보
          </div>

          <div className={style.more_div}><span>icon</span>전용 7평</div>
          <div className={style.more_div}><span>icon</span>전용 7평</div>
          <div className={style.more_div}><span>icon</span>전용 7평</div>
          <div className={style.more_div}><span>icon</span>전용 7평</div>
         
         
          <div onClick={() => closeDiv('more')} className={style.close_btn}>확인</div>
        </div>

      {/* box_3 */}
        <div className={style.info_maintenancebox}>
          <div style={{margin:'10px 0 0 0'}} className={style.bold_text}>관리비 9만원</div>
          <div style={{margin:'15px 0 0 0'}}>포함 : 수도, 인터넷, TV</div>
          <div>별도 : 전기세, 가스, 난방비</div>
        </div>


      {/* box_4 */}
      <div className={style.info_optionbox}>
        <div style={{margin:'10px 0 0 0'}} className={style.bold_text}>옵션 정보</div>
        <div className={style.info_optiontable}>
          <div className={style.option_box}>
            <div>아이콘</div>            
            <div>설명</div>            
          </div>
          <div className={style.option_box}>
            <div>아이콘</div>            
            <div>설명</div>      
          </div>
          <div className={style.option_box}>
            <div>아이콘</div>            
            <div>설명</div>      
          </div>
          <div className={style.option_box}>
            <div>아이콘</div>            
            <div>설명</div>      
          </div>
        </div>
        <div className={style.option_more_info}>모두보기 </div> 
      </div>


      {/* box_5 */}
      <div className={style.info_detail}>
          <div style={{margin:'10px 0 0 0'}} className={style.bold_text}>상세 설명</div>
          
          <div style={{margin:'15px 0 0 0'}}>
            √자연채광 으로 인해 싱그러운 아침 맞이！
          </div>
          <div>√금액 대비 최고의 퀄리티를 소유한 매물 </div>
      </div>

      {/* box_6 */}
      <div className={style.info_location}>
          <div style={{margin:'10px 0 0 0'}} className={style.bold_text}>위치</div>
          
          <div style={{margin:'20px 0 0 0'}}>
            {/*주소*/}{markerInfo.d}
          </div>
          <div className={style.info_map} id="map">
            
          </div>
      </div>


      {/* 맨 하단 문의하기 구역만큼 밀어서 공간확보 */}
        <div style={{height:'70px'}}></div>
      </div>

    {/* 문의하기 구역*/}
      <div className={style.bottom_box}>
        {/*월세*/}{markerInfo.b}
        <div className={style.bottom_btn}>
          문의하기
        </div>
      </div>
      {/* <h2>{markerInfo.title}</h2>
      <p>위도: {markerInfo.lat}</p>
      <p>경도: {markerInfo.lng}</p> */}
    </div>
  );
}

export default Info;