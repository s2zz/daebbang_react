//
import { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import {
  Map,
  MapMarker,
  ZoomControl,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";
import ItemsCarousel from "react-items-carousel";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

//
import style from "./Info.module.css";
import axios from "axios";
import Swal from "sweetalert2";
import backImg from "../assets/back_1.png";
import backImg_2 from "../assets/back_2.png";
import backImg_3 from "../assets/back_3.png";
import nextIMG from "../assets/next.png";
import prevIMG from "../assets/prev.png";
import medal from "../assets/medal.png";
import textFile from "../assets/textFile.png";

import aircon from "../assets/aircon.png";
import washingMachine from "../assets/washingMachine.png";
import bad from "../assets/bad.png";
import desk from "../assets/desk.png";
import wardrobe from "../assets/wardrobe.png";
import tv from "../assets/tv.png";
import refrigerator from "../assets/refrigerator.png";

import xImg from "../assets/xImg.png";

import land from "../assets/land.png";
import roomImg from "../assets/room.png";
import vehicleParking from "../assets/vehicleParking.png";
import building from "../assets/building.png";
import calendar from "../assets/calendar.png";
import elevator from "../assets/elevator.png";
import house from "../assets/house.png";
import heating from "../assets/heating.png";
import mapsAndFlags from "../assets/mapsAndFlags.png";
import realEstateHouse from "../assets/realEstate.png";
import noProfile from "../assets/noProfile.png";
import user from "../assets/user.png";
import certificate from "../assets/certificate.png";
import tellPhone from "../assets/telephone.png";
import estateMaker from "../assets/estateMaker.png";
import temperature from "../assets/temperature.png";



import proExam from "../assets/proExam.PNG";
import siren from "../assets/siren.png";

//
function Info(args, estate) {
  const info_scroll = useRef(null);

  const location = useLocation();
  const [markerInfo, setMarkerInfo] = useState(location.state); // markerInfo를 useState로 관리

  const navigate = useNavigate();

  // 마커에서 새로운 정보를 가져오면 Info 변경
  useEffect(() => {
    setMarkerInfo(location.state);
    console.log(markerInfo);
  }, [location.state]);

  const handleCarouselItemClick = (estate) => {
    setMarkerInfo(estate); // markerInfo를 업데이트하는데 useState를 사용
  };

  const handleMoreAgentClick = (marker) => {
    toggleSeller_more();
    setMarkerInfo(marker);
  };

  const { kakao } = window;

  // 캐러셀 넓이
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;

  // 공인중개사의 게시물 10개 가져오기
  const [estateListLimit, setEstateListLimit] = useState([{}]);
  const [estateListAll, setEstateListAll] = useState([{}]);

  const [imageUrls, setImageUrls] = useState([]);

  // 프로필 이미지
  const [profileImages, setProfileImages] = useState([]);

  useEffect(() => {
    const newImageUrls = markerInfo.images.map(
      (image) => `https://storage.googleapis.com/daebbang/estateImages/${image.sysName}`
    );
    setImageUrls(newImageUrls);
  }, [markerInfo, location.state]);

  // 공인중개사의 다른 게시물 10개 이미지 usl
  const [imageUrlsEstateLimit, setImageUrlsEstateLimit] = useState([]);
  const [imageUrlsEstateAll, setImageUrlsEstateAll] = useState([]);

  // 보고 있는 정보가 바뀌면 캐러샐의 이미지 0번으로 이동
  useEffect(() => {
    setActiveItemIndex(0);
  }, [markerInfo, location.state]);

  // 지도 밖에서 생성
  useEffect(() => {
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(markerInfo.latitude, markerInfo.longitude),
      level: 4,
    };
    var map = new kakao.maps.Map(container, options);

    // 마커가 표시될 위치입니다
    var markerPosition = new kakao.maps.LatLng(
      markerInfo.latitude,
      markerInfo.longitude
    );

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
      position: markerPosition,
    });

    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);
  }, [markerInfo, location.state]);

  // 돌아가기 버튼 이벤트
  const back = function () {
    window.history.back();
  };

  // 스크롤 감지 이벤트
  const handleScroll = () => {
    // info_scroll의 속성 중 scrollTop(탑)을 나타냄
    const scrollTop = info_scroll.current.scrollTop;

    // 만약 탑이 0이라면을 가지고 조건문을 검 --------
    if (scrollTop === 0) {
      //console.log('최상단입니다.');
      toggleVisibility_drag(true);
    } else {
      toggleVisibility_drag(false);
      //console.log(scrollTop);
    }
  };

  // 드래그 display 이벤트
  const [isVisible_drag, setIsVisible_drag] = useState(true);

  const toggleVisibility_drag = (state) => {
    if (state == true) {
      setIsVisible_drag(!isVisible_drag);
    } else {
      if (!isVisible_drag) {
        return;
      } else {
        setIsVisible_drag(!isVisible_drag);
      }
    }
  };

  useEffect(() => {
    // markerInfo가 변경될 때 실행될 콜백 함수
    // 이곳에서 markerInfo에 따른 원하는 동작을 수행할 수 있음

    // 스크롤 엘리먼트가 존재하고 markerInfo가 변경될 때 스크롤을 최상단으로 이동
    if (info_scroll.current) {
      info_scroll.current.scrollTop = 0;
    }
  }, [markerInfo, location.state]);

  // box_2 더보기 창 이벤트
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // box_4 모두보기 창 이벤트
  const [isVisible_more, setIsVisible_more] = useState(true);

  const toggleVisibility_more = () => {
    setIsVisible_more(!isVisible_more);
  };

  // box_7 공인 중개사 더보기 이벤트
  const [isSeller_more, setIsSeller_more] = useState(true);

  const toggleSeller_more = () => {
    setIsSeller_more(!isSeller_more);
  };

  // 공인 중개사의 최신 게시물 가져오기
  useEffect(() => {
    const email = markerInfo.realEstateAgent.email;

    // 10개만 가져옴
    axios
      .get(`/api/map/getAgentContentLimit`, {
        params: {
          email: email, // 쿼리 매개변수로 이메일을 전달
        },
      })
      .then((resp) => {
        console.log(resp.data);
        const fetchedData = resp.data;
        setEstateListLimit(fetchedData);

        const imageUrls = resp.data.map((item) => {
          // images 배열이 존재하고 첫 번째 요소가 있는 경우 해당 이미지의 URL을 생성
          if (item.images && item.images.length > 0) {
            return `/uploads/estateImages/${item.images[0].sysName}`;
          }
          // images 배열이 비어있는 경우 기본 이미지 URL을 사용
          return { noProfile };
        });

        setImageUrlsEstateLimit(imageUrls);
      })
      .catch((err) => {
        console.log("API 호출 오류:", err);
      });

    // 전부 가져옴
    axios
      .get(`/api/map/getAgentContentAll`, {
        params: {
          email: email, // 쿼리 매개변수로 이메일을 전달
        },
      })
      .then((resp) => {
        console.log(resp.data);
        const fetchedData = resp.data;
        setEstateListAll(fetchedData);

        const imageUrls = resp.data.map((item) => {
          // images 배열이 존재하고 첫 번째 요소가 있는 경우 해당 이미지의 URL을 생성
          if (item.images && item.images.length > 0) {
            return `/uploads/estateImages/${item.images[0].sysName}`;
          }
          // images 배열이 비어있는 경우 기본 이미지 URL을 사용
          return { noProfile };
        });

        setImageUrlsEstateAll(imageUrls);
      })
      .catch((err) => {
        console.log("API 호출 오류:", err);
      });

    axios
      .get(`/api/estate/profileImage/${email}`)
      .then((resp) => {
        // 이미지 태그를 상태에 설정
        setProfileImages(resp.data);

        console.log(resp.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [markerInfo, location.state]);

  //  LoginId
  const loginId = sessionStorage.getItem("loginId");

  // 문의하기 모달
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  // 문의하기 이중모달
  const [nestedModal, setNestedModal] = useState(false);

  const openNestedModal = () => {
    setNestedModal(true);
  };

  const closeNestedModal = () => {
    setNestedModal(false);
  };

  const toggleNestedModal = () => {
    setNestedModal(!nestedModal);
  };

  // 문의하기 버튼 클릭 이벤트
  const buttonEvent = () => {
    const estateId = markerInfo.estateId;
    axios
      .post("/api/reviewApproval/", {
        estateCode: estateId,
        userId: loginId,
      })
      .then((resp) => {
        // 성공 시, 이중 모달 표시 로직
        openNestedModal();
      })
      .catch((error) => {
        // 에러 처리 로직
      });
  };

  // 리뷰 목록 가져오기
  const [review, setReview] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/review/${markerInfo.estateId}`)
      .then((resp) => {
        setReview(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 리뷰 삭제하기
  const delReview = (seq) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      axios
        .delete(`/api/review/${seq}`)
        .then((resp) => {
          alert("리뷰가 삭제되었습니다");
          setReview((prev) => [...review.filter((e) => e.seq !== seq)]);
        })
        .catch((err) => {
          alert("리뷰 삭제에 실패하였습니다");
          console.log(err);
        });
    }
  };

  // (전세, 월세) 숫자 포맷팅
  function formatPrice(price) {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000);
      const remainder = price % 10000;
      return `${billion}억${
        remainder > 0 ? ` ${remainder.toLocaleString()}` : ""
      }`;
    }
    return price.toLocaleString();
  }

  // 관리비 숫자 포맷팅
  function formatMaintenanceCost(cost) {
    if (cost >= 10000) {
      const tenThousands = Math.floor(cost / 10000);
      const thousands = Math.floor((cost % 10000) / 1000);
      const hundreds = Math.floor((cost % 1000) / 100);
      const tens = Math.floor((cost % 100) / 10);
      const ones = cost % 10;

      return (
        `${tenThousands}만` +
        (thousands > 0 ? ` ${thousands}천` : "") +
        (hundreds > 0 ? ` ${hundreds}백` : "") +
        (tens > 0 ? ` ${tens}십` : "") +
        (ones > 0 ? ` ${ones}원` : "원")
      );
    }
    return cost.toLocaleString() + "원";
  }

  // 작성 날짜 포맷팅
  function formatWriteDate(writeDate) {
    const writeDateTime = new Date(writeDate).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - writeDateTime) / 1000);

    if (diffInSeconds < 60) {
      // 1분 미만
      return `${diffInSeconds}초 전`;
    } else if (diffInSeconds < 3600) {
      // 1시간 미만
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    } else if (diffInSeconds < 86400) {
      // 1일 미만
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    } else if (diffInSeconds < 2592000) {
      // 30일 미만
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
    } else {
      // 30일 이상인 경우 실제 작성 날짜 반환
      return new Date(writeDate).toLocaleDateString();
    }
  }

  // 주소 뒷자리 포맷팅
  function filterAddress(address) {
    const indexOfParenthesis = address.indexOf("(");
    if (indexOfParenthesis !== -1) {
      return address.substring(0, indexOfParenthesis).trim();
    }
    return address;
  }

  // 신고하기
  const [selectedOption, setSelectedOption] = useState("");
  const [content, setContent] = useState(""); // 상태 생성
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // 신고하기 모달
  const [firstModal, setFirstModal] = useState(false);
  const toggleFirstModal = () => setFirstModal(!firstModal);
  const [reportConfirmationModal, setReportConfirmationModal] = useState(false);

  // textarea 입력값을 상태로 설정
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // "신고 완료" 모달의 "확인" 버튼 클릭 시 처리
  const handleReportConfirmationModalConfirm = () => {
    // 모달을 닫지 않음
  };

  // "신고하기" 버튼 클릭 시 처리
  const handleOpenReportModal = () => {
    setFirstModal(true); // "신고하기" 모달 열기
    setReportConfirmationModal(false); // "신고 완료" 모달 닫기
  };

  //신고하기
  const handleReportSubmit = () => {
    axios
      .post("/api/map/report", {
        writer: loginId,
        contentsCode: selectedOption,
        taker: markerInfo.realEstateAgent.email,
        estateId: markerInfo.estateId,
        content: content,
      })
      .then((response) => {
        // 서버로부터의 응답 처리
        setContent(""); // 내용 초기화
        setSelectedOption(""); // 선택된 옵션 초기화
        setReportConfirmationModal(true); // "신고가 완료 되었습니다" 모달 열기
      })
      .catch((error) => {
        // 에러 처리
      });
  };

  // 리뷰 게시판으로 데이터 넘기기
  const handleReviewMoreInfoClick = () => {
    navigate("/review/boardReview", {
      state: { realEstateNumber: review[0].realEstateNumber },
    });
  };

  // 최신 매물 페이징처리
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 페이지당 아이템 수

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return estateListAll.slice(startIndex, endIndex);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // 이찬양 작업 공간
  // useEffect(() => {
  //   // markerInfo가 변경될 때 실행될 콜백 함수
  //   // 이곳에서 markerInfo에 따른 원하는 동작을 수행할 수 있음
  //   console.log("markerInfo가 변경됨:", markerInfo);

  //   var estateId = markerInfo.estateId;
  //   console.log("markerInfo estateId:", estateId);
  //   axios.post(`/api/visit/increaseViewCount/${estateId}`)
  //   .then(response => {
  //   })
  //   .catch(error => {
  //   });

  //   // 스크롤 엘리먼트가 존재하고 markerInfo가 변경될 때 스크롤을 최상단으로 이동
  //   if (info_scroll.current) {
  //     info_scroll.current.scrollTop = 0;
  //   }
  // }, [markerInfo]);

  return (
    <div
      ref={info_scroll}
      className={style.info_main}
      onScroll={() => handleScroll(info_scroll.current)}
    >
      {markerInfo && (
        <div>
          {/* 정보 표기 구역*/}

          <div>
            {/* 드래그 이벤트에 의한 최상단 박스 (구현 못함 현재 display:none 상태임)*/}
            {isVisible_drag ? null : (
              <div className={style.address_box} style={{ display: "block" }}>
                <div onClick={() => back()}>
                  <img src={backImg_3} style={{ width: "28px" }}></img>
                </div>
                {/*주소*/}
                {markerInfo.address2}
              </div>
            )}

            {/* 드래그 이벤트에 의한 최상단 박스 끝*/}

            {/* 슬라이드 쇼*/}
            <div className={style.info_img}>
              <div className={style.info_img_top} onClick={() => back()}>
                <img src={backImg} style={{ width: "28px" }}></img>
              </div>

              <div>
                {" "}
                <ItemsCarousel
                  requestToChangeActive={setActiveItemIndex}
                  activeItemIndex={activeItemIndex}
                  numberOfCards={1}
                  gutter={0}
                  leftChevron={
                    <img src={prevIMG} style={{ width: "40px" }}></img>
                  }
                  rightChevron={
                    <img src={nextIMG} style={{ width: "40px" }}></img>
                  }
                  outsideChevron={false}
                  chevronWidth={chevronWidth}
                >
                  {/* {imageUrls.map((url, index) => (
                    <div
                      key={index}
                      style={{ height: "300px", background: "#EEE" }}
                    >
                      <img
                        src={url}
                        alt={`Item ${index}`}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ))} 
                  
                                    {imageUrls.map((url) => (
                    <div
                      key={url}
                      style={{ height: "300px", background: "#EEE" }}
                    >
                      <img
                        src={url}
                        alt="Estate"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ))}

                  
                  
                  여기 프롭스 키 오류 때문에 바꿈*/}

                  {imageUrls.map((url, index) => (
                    <div
                      key={index} // 인덱스를 key로 사용
                      style={{ height: "300px", background: "#EEE" }}
                    >
                      <img
                        src={url}
                        alt="Estate"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  ))}
                </ItemsCarousel>
              </div>
            </div>

            {/* box_1 */}
            <div className={style.info_title}>
              <div className={style.info_title_top}>
                <div className={style.info_idx}>
                  등록번호 {/*등록번호 넣기*/}
                  {markerInfo.estateId}
                </div>
                <div className={style.info_day}>
                  {/*몇일 전 넣기*/}
                  {formatWriteDate(markerInfo.writeDate)}
                </div>
              </div>

              <div className={style.info_address}>
                {/*주소*/}
                {markerInfo.address2}
              </div>
              {/* 월세*/}
              <div className={style.info_cost}>
                {markerInfo.transaction.transactionType}{" "}
                {markerInfo.deposit === 0
                  ? `${formatPrice(markerInfo.price)}`
                  : `${formatPrice(markerInfo.deposit)} / ${formatPrice(
                      markerInfo.price
                    )}`}
              </div>
              <div className={style.info_maintenance_cost}>
                {/*관리비*/}{" "}
                {markerInfo.maintenanceCost === 0
                  ? "관리비 없음"
                  : `관리비 ${formatMaintenanceCost(
                      markerInfo.maintenanceCost
                    )}`}
              </div>
            </div>

            {/* box_2 */}
            <div className={style.info_subbox}>
              <div style={{ margin: "10px 0 0 0" }}>{markerInfo.title}</div>
              {/* 몇 평인지*/}
              <div className={style.subbox_bold}>
                <span>
                  <img
                    src={land}
                    style={{ width: "24px", height: "24px" }}
                  ></img>
                </span>
                전용 {markerInfo.area}평
              </div>
              {/* 집 타입*/}
              <div className={style.subbox_bold}>
                <span>
                  <img
                    src={roomImg}
                    style={{ width: "24px", height: "24px" }}
                  ></img>
                </span>
                {markerInfo.structure.structureType}
              </div>
              {/* 집 주차 여부*/}
              <div>
                <span>
                  <img
                    src={vehicleParking}
                    style={{ width: "24px", height: "24px" }}
                  ></img>
                </span>
                {markerInfo.optionList &&
                markerInfo.optionList.length > 0 &&
                markerInfo.optionList.some(
                  (option) => option.optionTitle.optionName === "주차장"
                )
                  ? "주차 가능"
                  : "주차 불가능"}
              </div>
              {/* 층수 정보 */}
              <div>
                <span>
                  <img
                    src={building}
                    style={{ width: "24px", height: "24px" }}
                  ></img>
                </span>
                {markerInfo.roomFloors === -1
                  ? "반지하"
                  : markerInfo.roomFloors === 0
                  ? "옥탑방"
                  : `${markerInfo.roomFloors}층 / ${markerInfo.buildingFloors}층`}
              </div>
              {/* 단기 가능 정보 */}
              <div>
                <span>
                  <img
                    src={calendar}
                    style={{ width: "24px", height: "24px" }}
                  ></img>
                </span>
                {markerInfo.optionList &&
                markerInfo.optionList.length > 0 &&
                markerInfo.optionList.some(
                  (option) => option.optionTitle.optionName === "단기가능"
                )
                  ? "단기 임대 가능"
                  : "단기 임대 불가능"}
              </div>
              <div className={style.more_info} style={{ marginTop: "0px" }}>
                <div
                  className={style.more_info_text}
                  onClick={toggleVisibility}
                >
                  더보기
                </div>
              </div>
            </div>

            {/* box_2 더보기 창 */}

            {/* 조건에 따라 display: none을 적용하려면 삼항 연산자를 사용합니다. */}
            {isVisible ? null : (
              <div className={style.more_info_box} style={{ display: "block" }}>
                <div className={style.more_info_box_top}>
                  <div onClick={toggleVisibility}>
                    {" "}
                    <img src={xImg} style={{ width: "20px" }}></img>
                  </div>
                  매물 정보
                </div>

                {/* 평수 */}
                <div className={style.more_div_bold}>
                  <span>
                    <img
                      src={land}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  전용 {markerInfo.area}평
                </div>

                {/* 건물 구조 */}
                <div className={style.more_div_bold}>
                  <span>
                    <img
                      src={roomImg}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.structure.structureType}
                </div>

                {/* 주차 가능 여부 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={vehicleParking}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "주차장"
                  )
                    ? "주차 가능"
                    : "주차 불가능"}
                </div>

                {/* 층수 여부 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={building}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.roomFloors === -1
                    ? "반지하"
                    : markerInfo.roomFloors === 0
                    ? "옥탑방"
                    : `${markerInfo.roomFloors}층 / ${markerInfo.buildingFloors}층`}
                </div>

                {/* 단기 임대 여부 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={calendar}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "단기가능"
                  )
                    ? "단기 임대 가능"
                    : "단기 임대 불가능"}
                </div>

                {/* 단기 임대 여부 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={elevator}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.optionList &&
                  markerInfo.optionList.length > 0 &&
                  markerInfo.optionList.some(
                    (option) => option.optionTitle.optionName === "엘리베이터"
                  )
                    ? "엘리베이터 있음"
                    : "엘리베이터 없음"}
                </div>

                {/* 건물 구조 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={house}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.building.buildingType}
                </div>

                {/* 난방 구조 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={heating}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {markerInfo.heatingSystem.heatingType}
                </div>

                {/* 주소 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={mapsAndFlags}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  {filterAddress(markerInfo.address1)}
                </div>

                {/* 등록번호 */}
                <div className={style.more_div}>
                  <span>
                    <img
                      src={realEstateHouse}
                      style={{ width: "24px", height: "24px" }}
                    ></img>
                  </span>
                  등록번호 {markerInfo.estateId}
                </div>
                <div onClick={toggleVisibility} className={style.close_btn}>
                  확인
                </div>
              </div>
            )}

            {/* box_3*/}
            {/*  
        <div className={style.info_maintenancebox}>
          <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
            관리비 9만원
          </div>
          <div style={{ margin: "15px 0 0 0" }}>포함 : 수도, 인터넷, TV</div>
          <div>별도 : 전기세, 가스, 난방비</div>
        </div>
        */}

            {/* box_4 */}
            <div className={style.info_optionbox}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                옵션 정보
              </div>
              <div className={style.info_optiontable_parent}>
                <div className={style.info_optiontable}>
                  {markerInfo.optionList &&
                  markerInfo.optionList.filter(
                    (option) =>
                      option.optionTitle.optionName !== "주차장" &&
                      option.optionTitle.optionName !== "단기가능" &&
                      option.optionTitle.optionName !== "엘리베이터"
                  ).length > 0 ? (
                    markerInfo.optionList
                      .filter(
                        (option) =>
                          option.optionTitle.optionName !== "주차장" &&
                          option.optionTitle.optionName !== "단기가능" &&
                          option.optionTitle.optionName !== "엘리베이터"
                      )
                      .slice(0, 4)
                      .map((option, index) => (
                        <div key={index} className={style.option_box}>
                          <div>
                            {option.optionTitle.optionName === "에어컨" && (
                              <img
                                src={aircon}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="에어컨"
                              />
                            )}
                            {option.optionTitle.optionName === "세탁기" && (
                              <img
                                src={washingMachine}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="세탁기"
                              />
                            )}
                            {option.optionTitle.optionName === "침대" && (
                              <img
                                src={bad}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="침대"
                              />
                            )}
                            {option.optionTitle.optionName === "책상" && (
                              <img
                                src={desk}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="책상"
                              />
                            )}
                            {option.optionTitle.optionName === "옷장" && (
                              <img
                                src={wardrobe}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="옷장"
                              />
                            )}
                            {option.optionTitle.optionName === "TV" && (
                              <img
                                src={tv}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="TV"
                              />
                            )}
                            {option.optionTitle.optionName === "냉장고" && (
                              <img
                                src={refrigerator}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="냉장고"
                              />
                            )}
                          </div>
                          <div>{option.optionTitle.optionName}</div>
                        </div>
                      ))
                  ) : (
                    <div style={{ margin: "10px 0 10px" }}>
                      옵션 정보가 없습니다.
                    </div>
                  )}
                </div>
              </div>

              <div className={style.option_more_info_parent}>
                {markerInfo.optionList.filter(
                  (option) =>
                    option.optionTitle.optionName !== "주차장" &&
                    option.optionTitle.optionName !== "단기가능" &&
                    option.optionTitle.optionName !== "엘리베이터"
                ).length > 4 && (
                  <div
                    className={style.more_info}
                    onClick={toggleVisibility_more}
                  >
                    <div className={style.more_info_text}>{`${
                      markerInfo.optionList.filter(
                        (option) =>
                          option.optionTitle.optionName !== "주차장" &&
                          option.optionTitle.optionName !== "단기가능" &&
                          option.optionTitle.optionName !== "엘리베이터"
                      ).length
                    }개 모두 보기`}</div>
                  </div>
                )}
              </div>
            </div>

            {/* box_4 모두보기 창 */}

            {/* 조건에 따라 display: none을 적용하려면 삼항 연산자를 사용합니다. */}
            {isVisible_more ? null : (
              <div className={style.more_info_box} style={{ display: "block" }}>
                <div className={style.more_info_box_top}>
                  <div onClick={toggleVisibility_more}>
                    <img src={xImg} style={{ width: "20px" }}></img>
                  </div>
                  옵션 정보
                </div>

                {markerInfo.optionList &&
                markerInfo.optionList.filter(
                  (option) =>
                    option.optionTitle.optionName !== "주차장" &&
                    option.optionTitle.optionName !== "단기가능" &&
                    option.optionTitle.optionName !== "엘리베이터"
                ).length > 0 ? (
                  markerInfo.optionList
                    .filter(
                      (option) =>
                        option.optionTitle.optionName !== "주차장" &&
                        option.optionTitle.optionName !== "단기가능" &&
                        option.optionTitle.optionName !== "엘리베이터"
                    )
                    .map((option, index) => (
                      <div>
                        {option.optionTitle.optionName === "에어컨" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={aircon}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="에어컨"
                              />
                            </span>
                            에어컨
                          </div>
                        )}
                        {option.optionTitle.optionName === "세탁기" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={washingMachine}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="세탁기"
                              />
                            </span>
                            세탁기
                          </div>
                        )}
                        {option.optionTitle.optionName === "침대" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={bad}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="침대"
                              />
                            </span>
                            침대
                          </div>
                        )}
                        {option.optionTitle.optionName === "책상" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={desk}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="책상"
                              />
                            </span>
                            책상
                          </div>
                        )}
                        {option.optionTitle.optionName === "옷장" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={wardrobe}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="옷장"
                              />
                            </span>
                            옷장
                          </div>
                        )}
                        {option.optionTitle.optionName === "TV" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={tv}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="옷장"
                              />
                            </span>
                            TV
                          </div>
                        )}
                        {option.optionTitle.optionName === "냉장고" && (
                          <div className={style.more_div}>
                            <span>
                              <img
                                src={refrigerator}
                                style={{ width: "24px", marginBottom: "3px" }}
                                alt="옷장"
                              />
                            </span>
                            냉장고
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div style={{ margin: "10px 0 10px" }}>
                    옵션 정보가 없습니다.
                  </div>
                )}

                <div
                  onClick={toggleVisibility_more}
                  className={style.close_btn}
                >
                  확인
                </div>
              </div>
            )}

            {/* box_5 */}
            <div className={style.info_detail}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                상세 설명
              </div>

              <div style={{ margin: "10px 0 10px 0" }}>
                {markerInfo.contents}
              </div>
            </div>

            {/* box_6 */}
            <div className={style.info_location}>
              <div style={{ margin: "10px 0 0 0" }} className={style.bold_text}>
                위치
              </div>

              <div style={{ margin: "20px 0 0 0" }}>
                {/*주소*/}
                {markerInfo.address2}
              </div>
              <div className={style.info_map} id="map"></div>
            </div>

            {/* <div className={style.seller_best}>추천중개사란?</div> */}
            {/* box_7 */}
            <div className={style.seller_box}>
              <div className={style.seller_info} onClick={toggleSeller_more}>
                <div className={style.seller_img}>
                  {profileImages && profileImages.length > 0 ? (
                    profileImages.map((preview, index) => (
                      <img
                        key={index}
                        src={` https://storage.googleapis.com/daebbang/agentProfiles/${preview.sysName}`}
                        alt={`Preview`}
                        className={style.imagePreview}
                        style={{ width: "100%", borderRadius: "50%" }}
                      />
                    ))
                  ) : (
                    <img
                      src={noProfile}
                      style={{ width: "100%", borderRadius: "50%" }}
                    ></img>
                  )}
                </div>
                <div className={style.seller_title}>
                  <div>
                    {markerInfo.realEstateAgent.manners_temperature >= 40 ? (
                      <span className={style.recommend}>
                        <b>추천</b>
                      </span>
                    ) : (
                      ""
                    )}

                    <span className={style.grade}>
                      {markerInfo.realEstateAgent.manners_temperature}도
                    </span>
                  </div>
                  <b>{markerInfo.realEstateAgent.estateName}</b>
                </div>
              </div>
              {markerInfo.realEstateAgent.manners_temperature >= 40 ? (
                <div className={style.safe_seller}>추천중개사</div>
              ) : (
                ""
              )}
              {markerInfo.realEstateAgent.manners_temperature >= 40 ? (
                <div className={style.seller_box_1}>
                  <div>
                    <img src={medal} style={{ height: "100%" }}></img>
                  </div>
                  <div style={{ paddingLeft: "15px" }}>
                    {markerInfo.realEstateAgent.estateName}는 매너 온도가 높은
                    추천 중개사입니다.
                  </div>
                </div>
              ) : (
                ""
              )}

              {markerInfo.realEstateAgent.manners_temperature >= 40 ? "" : ""}
              <div className={style.seller_box_2}>
                <div>
                  <img src={textFile} style={{ height: "100%" }}></img>
                </div>
                <div style={{ paddingLeft: "15px", fontSize: "15px" }}>
                  {markerInfo.realEstateAgent.content
                    ? markerInfo.realEstateAgent.content
                    : "인삿말이 없습니다."}
                </div>
              </div>
              {/*
              <div className={style.more_info}>
                <div className={style.more_info_text}>더보기</div>
              </div>
               여기서 더보기  뺌*/}
            </div>

            {/* box_8 공인 중개사 게시물*/}
            <div className={style.seller_slide_box}>
              <div
                style={{ margin: "10px 0 0 0" }}
                className={style.bold_text_small}
              >
                <b>{markerInfo.realEstateAgent.estateName}의 최신 매물</b>
              </div>
              <div className={style.slide_frame}>
                {/* <div className={style.slide_item_box}>
              <div>사진</div>
              <div>
                <span className={style.bold_text_small}>월세 300/28</span>
                <span>천안시 서북구 쌍용동</span>
                <span style={{ color: "#808080" }}>원룸-분리형원룸</span>
              </div>
            </div> */}

                {estateListLimit.length === 0 ? (
                  <div className={style.slide_item_box}>
                    중개사의 다른 집이 존재하지 않습니다.
                  </div>
                ) : (
                  <ItemsCarousel
                    requestToChangeActive={setActiveItemIndex}
                    activeItemIndex={activeItemIndex}
                    numberOfCards={2}
                    gutter={130}
                    infiniteLoop={true}
                    leftChevron={
                      <img src={prevIMG} style={{ width: "40px" }}></img>
                    }
                    rightChevron={
                      <img src={nextIMG} style={{ width: "40px" }}></img>
                    }
                    outsideChevron={false}
                    chevronWidth={chevronWidth}
                  >
                    {estateListLimit.map((estate, index) => (
                      <div
                        key={estate.id}
                        className={style.slide_item_box}
                        onClick={() => handleCarouselItemClick(estate)}
                      >
                        <div>
                          <img
                            src={imageUrlsEstateLimit[index]}
                            alt={`Property ${index}`}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                        <div>
                          <span className={style.bold_text_small}>
                            {estate.transaction &&
                              `${estate.transaction.transactionType} ${
                                estate.deposit === 0
                                  ? estate.price
                                  : `${formatPrice(
                                      estate.deposit
                                    )} / ${formatPrice(estate.price)}`
                              }`}
                          </span>
                          <span>{estate.address2}</span>
                          <span>
                            {estate.room &&
                              `${estate.room.roomType} · ${estate.structure.structureType}`}
                          </span>
                          <span style={{ color: "#808080" }}>
                            {/* 부동산 유형 */}
                          </span>
                        </div>
                      </div>
                    ))}
                  </ItemsCarousel>
                )}
              </div>
              <div className={style.more_info}>
                <div
                  className={style.more_info_text}
                  onClick={toggleSeller_more}
                >
                  더보기
                </div>
              </div>
              {/* 여기서 더보기 옆에서 > 뺌*/}
            </div>

            {/* 공인 중개사 정보 더 보기*/}
            {isSeller_more ? null : (
              <div
                className={style.more_seller_box}
                style={{ display: "block" }}
              >
                <div className={style.address_box_fix}>
                  <div onClick={toggleSeller_more}>
                    {" "}
                    <img src={xImg} style={{ width: "20px" }}></img>
                  </div>
                  {markerInfo.realEstateAgent.estateName}
                </div>
                {profileImages && profileImages.length > 0 ? (
                  profileImages.map((preview, index) => (
                    <img
                      key={index}
                      src={` https://storage.googleapis.com/daebbang/agentProfiles/${preview.sysName}`}
                      alt={`Preview`}
                      className={style.imagePreview}
                      style={{ width: "100%", height: "300px" }}
                    />
                  ))
                ) : (
                  <img
                    src={noProfile}
                    style={{
                      width: "100%",
                      marginTop: "60px",
                    }}
                  ></img>
                )}

                <div className={style.info_title} style={{ height: "auto" }}>
                  <div className={style.info_title_top}>
                    {markerInfo.realEstateAgent.manners_temperature >= 40 ? (
                      <div className={style.seller_idx}>
                        추천 중개사 {/*등록번호 넣기*/}
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className={style.info_cost}
                    style={{ marginTop: "10px" }}
                  >
                    {markerInfo.realEstateAgent.estateName}
                  </div>

                  {/* 이름 */}
                  <div className={style.more_div_seller}>
                    <span>
                      <img src={user} style={{ width: "24px" }}></img>
                    </span>
                    <div>{markerInfo.realEstateAgent.name}</div>
                  </div>

                  {/* 번호 */}
                  <div className={style.more_div_seller}>
                    <span>
                      <img src={tellPhone} style={{ width: "24px" }}></img>
                    </span>
                    <div>{markerInfo.realEstateAgent.phone}</div>
                  </div>

                  {/* 온도 */}
                  <div className={style.more_div_seller}>
                    <span>
                      <img src={temperature} style={{ width: "24px" }}></img>
                    </span>
                    <div>{markerInfo.realEstateAgent.manners_temperature}도</div>
                  </div>

                  {/* 등록번호 */}
                  <div className={style.more_div_seller}>
                    <span>
                      <img src={certificate} style={{ width: "24px" }}></img>
                    </span>
                    <div>
                      등록번호 {markerInfo.realEstateAgent.estateNumber}
                    </div>
                  </div>

                  {/* 주소 */}
                  <div className={style.more_div_seller}>
                    <span>
                      <img src={estateMaker} style={{ width: "24px" }}></img>
                    </span>
                    <div>{markerInfo.realEstateAgent.address}</div>
                  </div>

                  <div className={style.seller_map}>
                    <Map // 지도를 표시할 Container
                      center={{
                        // 지도의 중심좌표
                        lat: markerInfo.realEstateAgent.latitude,
                        lng: markerInfo.realEstateAgent.longitude,
                      }}
                      style={{
                        // 지도의 크기
                        width: "100%",
                        height: "100%",
                      }}
                      level={4} // 지도의 확대 레벨
                    >
                      <MapMarker // 마커를 생성합니다
                        position={{
                          // 마커가 표시될 위치입니다
                          lat: markerInfo.realEstateAgent.latitude,
                          lng: markerInfo.realEstateAgent.longitude,
                        }}
                      />
                      <CustomOverlayMap // 커스텀 오버레이를 표시할 Container
                        // 커스텀 오버레이가 표시될 위치입니다
                        position={{
                          lat: markerInfo.realEstateAgent.latitude,
                          lng: markerInfo.realEstateAgent.longitude,
                        }}
                      >
                        {/* 커스텀 오버레이에 표시할 내용입니다 */}
                        <div
                          className="label"
                          style={{
                            color: "white",
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            padding: "2px 6px 1px 6px",
                            fontSize: "11px",
                            marginTop: "20px",
                          }}
                        >
                          <span className="left"></span>
                          <span className="center">부동산 위치</span>
                          <span className="right"></span>
                        </div>
                      </CustomOverlayMap>
                    </Map>
                  </div>
                </div>

                {/* 인삿말 */}
                <div className={style.info_title} style={{ height: "auto" }}>
                  <div
                    className={style.info_title_top}
                    style={{ fontSize: "18px" }}
                  >
                    <b>인삿말</b>
                  </div>
                  <div style={{ marginTop: "10px" }}>
                    {markerInfo.realEstateAgent.content || "인삿말이 없습니다"}
                  </div>
                </div>

                {/* 최근 매물 */}
                <div className={style.info_title} style={{ height: "auto" }}>
                  <div
                    className={style.info_title_top}
                    style={{ fontSize: "18px" }}
                  >
                    <b>매물 목록</b>
                  </div>

                  {/*매물 목록 페이징 처리*/}
                  <Stack spacing={2}>
                    <div style={{ marginTop: "10px" }}>
                      {getPaginatedData().map((marker, index) => (
                        <div
                          key={index}
                          className={style.list_box}
                          onClick={() => handleMoreAgentClick(marker)}
                        >
                          <div className={style.list_box_img}>
                            <img
                              src={imageUrlsEstateLimit[index]}
                              alt="Estate"
                            />
                          </div>
                          <div className={style.list_box_text}>
                            <div className={style.list_box_top}>
                              {marker.structure.structureType}
                            </div>
                            <div className={style.list_title}>
                              {marker.transaction.transactionType}{" "}
                              {marker.deposit === 0
                                ? `${formatPrice(marker.price)}`
                                : `${formatPrice(
                                    marker.deposit
                                  )} / ${formatPrice(marker.price)}`}
                            </div>
                            <div className={style.list_subtitle}>
                              {marker.area}
                              {"평 · "}
                              {marker.roomFloors === -1
                                ? "반지하"
                                : marker.roomFloors === 0
                                ? "옥탑방"
                                : `${marker.roomFloors}층`}
                            </div>
                            <div className={style.list_subtitle}>
                              {marker.address2}
                            </div>
                            <div className={style.list_simple}>
                              {marker.title}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                      }}
                    >
                      <Pagination
                        count={Math.ceil(estateListAll.length / itemsPerPage)}
                        page={currentPage}
                        onChange={handlePageChange}
                      />
                    </div>
                  </Stack>
                </div>
              </div>
            )}

            {/* 리뷰 */}
            <div className={style.review_list_frame}>
              <div
                style={{ margin: "10px 0 0 0" }}
                className={style.bold_text_small}
              >
                <b>해당 매물의 최신 리뷰</b>
              </div>
              {review.length === 0 ? (
                <div className={style.review_list_frame_parent}>
                  최신 리뷰가 없습니다.
                </div>
              ) : (
                review.map((e, i) => (
                  <div className={style.review_list_frame_parent} key={i}>
                    <div className={style.review_list_frame_child}>
                      {/* 이미지 */}
                      {e.files.map((e, i) => (
                        <div className={style.review_list_frame_child_img}>
                          <img
                            alt="..."
                            style={{ width: "100%", height: "100%" }}
                            src={` https://storage.googleapis.com/daebbang/review/${e.sysName}`}
                          />
                        </div>
                      ))}

                      {/* 하단 내용 */}
                      <div className={style.review_list_frame_child_content}>
                        <div>
                          <b>{e.anonymous ? e.id : "익명"}님</b>의 리뷰{" "}
                          {e.score}점
                        </div>

                        <div
                          className={style.review_list_frame_child_content_semi}
                        >
                          <div>
                            <b>교통 정보</b>
                          </div>
                          <div>{e.traffic}</div>
                        </div>

                        <div
                          className={style.review_list_frame_child_content_semi}
                        >
                          <div>
                            <b>주변 환경</b>
                          </div>
                          <div>{e.surroundings}</div>
                        </div>

                        <div
                          className={style.review_list_frame_child_content_semi}
                        >
                          <div>
                            <b>시설</b>
                          </div>
                          <div>{e.facility}</div>
                        </div>

                        {/*<div>
                         <button
                        onClick={() => {
                          delReview(e.seq);
                        }}
                      >
                        삭제
                      </button>
                      <Link to="/review/editReview" state={{ seq: e.seq }}>
                        <button>수정</button>
                      </Link> 
                      </div>*/}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {/* 여기서 매물 게시판으로 날라가면 됨 */}
              {review.length > 0 && (
                <div className={style.more_info}>
                  <div
                    className={style.more_info_text}
                    onClick={handleReviewMoreInfoClick}
                  >
                    더보기
                  </div>
                </div>
              )}
            </div>

            {/* 신고하기 구역*/}
            <div className={style.report_frame}>
              <div className={style.report_frame_box}>
                <img
                  src={siren}
                  style={{ width: "24px", marginRight: "5px" }}
                ></img>
                <div
                  className={style.report_button}
                  style={{ marginTop: "3px" }}
                  onClick={handleOpenReportModal}
                >
                  신고하기
                </div>
              </div>
              <Modal isOpen={firstModal} toggle={toggleFirstModal}>
                <ModalHeader toggle={toggleFirstModal}>
                  <b>신고하기</b>
                </ModalHeader>
                <ModalBody>
                  {loginId === null ? (
                    <p>로그인 후 이용해 주세요.</p>
                  ) : (
                    <div>
                      <p>정확한 신고를 위해 내용을 선택해 주세요.</p>
                      <div className="report-option">
                        <input
                          type="radio"
                          id="option1"
                          name="report"
                          value="rc1"
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label
                          style={{ margin: "0 0 3px 3px" }}
                          htmlFor="option1"
                        >
                          거래 완료된 매물입니다.
                        </label>
                      </div>
                      <div className="report-option">
                        <input
                          type="radio"
                          id="option2"
                          name="report"
                          value="rc2"
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label
                          style={{ margin: "0 0 3px 3px" }}
                          htmlFor="option2"
                        >
                          보증금, 월세 등 금액이 다릅니다.
                        </label>
                      </div>
                      <div className="report-option">
                        <input
                          type="radio"
                          id="option3"
                          name="report"
                          value="rc3"
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label
                          style={{ margin: "0 0 3px 3px" }}
                          htmlFor="option3"
                        >
                          매물 주소와 등록된 사진이 다릅니다.
                        </label>
                      </div>
                      <div className="report-option">
                        <input
                          type="radio"
                          id="option4"
                          name="report"
                          value="rc4"
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label
                          style={{ margin: "0 0 3px 3px" }}
                          htmlFor="option4"
                        >
                          매물의 용도, 구조, 옵션 등 정보가 다릅니다.
                        </label>
                      </div>
                      <div className="report-option">
                        <input
                          type="radio"
                          id="option5"
                          name="report"
                          value="rc5"
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label
                          style={{ margin: "0 0 15px 3px" }}
                          htmlFor="option5"
                        >
                          기타
                        </label>
                      </div>
                      <textarea
                        className="report-textarea"
                        placeholder="상세한 신고 내용을 작성해주세요 (최대 500자)."
                        maxLength="500"
                        onChange={handleContentChange} // onChange 핸들러 추가
                        value={content} // textarea의 value를 상태와 연결
                        style={{ width: "100%" }}
                      ></textarea>
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  {loginId === null ? (
                    <>
                      <Button
                        color="primary"
                        onClick={() => navigate("/login")}
                      >
                        로그인
                      </Button>
                      <Button color="secondary" onClick={toggleFirstModal}>
                        닫기
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button color="primary" onClick={handleReportSubmit}>
                        신고
                      </Button>
                      <Button
                        color="secondary"
                        onClick={() => {
                          toggleFirstModal();
                          setContent("");
                        }}
                      >
                        닫기
                      </Button>
                    </>
                  )}
                </ModalFooter>
                <Modal
                  isOpen={reportConfirmationModal}
                  toggle={() => setReportConfirmationModal(false)}
                >
                  <ModalHeader>신고 완료</ModalHeader>
                  <ModalBody>신고가 완료 되었습니다.</ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={() => {
                        setReportConfirmationModal(false); // "신고 완료" 모달 닫기
                        toggleFirstModal(); // 기존 모달 열기
                      }}
                    >
                      확인
                    </Button>
                  </ModalFooter>
                </Modal>
              </Modal>
            </div>

            {/* 맨 하단 문의하기 구역만큼 밀어서 공간확보 */}
            <div style={{ height: "70px" }}></div>
          </div>

          {/* 문의하기 구역*/}
          <div className={style.bottom_box}>
            {/*월세*/}
            {markerInfo.transaction.transactionType}{" "}
            {markerInfo.deposit === 0
              ? `${formatPrice(markerInfo.price)}`
              : `${formatPrice(markerInfo.deposit)} / ${formatPrice(
                  markerInfo.price
                )}`}
            <div className={style.bottom_btn} onClick={toggle}>
              문의하기
            </div>
            {/* 문의하기 모달창 */}
            <div>
              <Modal isOpen={modal} toggle={toggle} {...args}>
                <ModalHeader toggle={toggle}>
                  <b>문의하기</b>
                </ModalHeader>
                <ModalBody>
                  {loginId === null ? (
                    "로그인 후 이용해 주세요."
                  ) : (
                    <div>
                      등록되어 있는 연락처가 중개사님께 전달되며.<br></br>
                      통화 연결시 품질 향상을 위해 통화 내용이 녹음됩니다.
                    </div>
                  )}
                </ModalBody>
                <ModalFooter>
                  {loginId === null ? (
                    <Button color="primary" onClick={() => navigate("/login")}>
                      로그인
                    </Button>
                  ) : (
                    <Button color="primary" onClick={buttonEvent}>
                      문의하기
                    </Button>
                  )}
                  <Button color="secondary" onClick={toggle}>
                    닫기
                  </Button>
                </ModalFooter>
                <Modal isOpen={nestedModal} toggle={toggleNestedModal}>
                  <ModalHeader toggle={toggleNestedModal}>
                    <b>문의하기</b>
                  </ModalHeader>
                  <ModalBody>문의가 완료되었습니다.</ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={() => {
                        toggleNestedModal();
                        toggle();
                      }}
                    >
                      확인
                    </Button>
                  </ModalFooter>
                </Modal>
              </Modal>
            </div>
          </div>
          {/* <h2>{markerInfo.title}</h2>
      <p>위도: {markerInfo.lat}</p>
      <p>경도: {markerInfo.lng}</p> */}

          <div></div>
        </div>
      )}
    </div>
  );
}

export default Info;
