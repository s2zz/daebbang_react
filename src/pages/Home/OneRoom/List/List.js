//
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

//
import Info from "../Info/Info";

//
import turn from "../assets/turn.PNG";
import plzZoom from "../assets/plzZoom.png";
import emptyBox from "../assets/emptyBox.png";
import rotateNew from "../assets/rotate_new.png";
import rotateManner from "../assets/rotate_manner.png";

//
import style from "./List.module.css";

function List({ onDragEnd, listReady }) {
  const navigate = useNavigate();
  const location = useLocation();

  // 전달된 데이터 추출
  const { markersInBounds, zoomLevel } = location.state || {};

  // 작성자(공인중개사) 매너온도 가져오기
  const [markerSize, setMarkerSize] = useState("");

  // 매너온도를 저장하기 위한 상태
  const [mannersTemperatureList, setMannersTemperatureList] = useState([]);

  useEffect(() => {
    // markersInBounds가 존재하고 객체인 경우에만 길이를 계산
    if (markersInBounds && typeof markersInBounds === "object") {
      // setMarkerSize 함수를 올바르게 호출
      setMarkerSize(Object.keys(markersInBounds).length);
    }
  }, [markersInBounds]); // markersInBounds 의존성 배열에 포함

  // 마커를 클릭하면 해당 마커의 내용을 들고 정보(info)로 감
  // 마커를 클릭하여 쿠키에 정보 추가
  const handleMarkerClick = (marker) => {
    navigate("/home/oneroom/info", { state: marker });

    // 로컬 스토리지에서 현재 감시 중인 속성 가져오기
    const storedData = localStorage.getItem("watch");
    const watchedProperties = storedData ? JSON.parse(storedData) : [];

    // 새로운 마커의 estateId를 감시 중인 속성에 추가
    const updatedWatchedProperties = [
      ...new Set([marker.estateId, ...watchedProperties]),
    ];
    // 감시 중인 속성을 최대 10개로 제한
    if (updatedWatchedProperties.length > 10) {
      updatedWatchedProperties.splice(10);
    }
    // 갱신된 감시 중인 속성을 로컬 스토리지에 저장
    localStorage.setItem("watch", JSON.stringify(updatedWatchedProperties));
  };

  // 숫자 포맷팅
  function formatPrice(price) {
    if (price >= 10000) {
      const billion = Math.floor(price / 10000);
      const remainder = price % 10000;
      return `${billion}억${remainder > 0 ? ` ${remainder.toLocaleString()}` : ""
        }`;
    }
    return price.toLocaleString();
  }

  // 작성자(공인중개사) 매너온도 가져오기
  useEffect(() => {
    // markersInBounds가 null이 아니고, 배열인 경우에만 실행
    if (markersInBounds && Array.isArray(markersInBounds)) {
      const emailList = markersInBounds
        .filter(
          (marker) => marker.realEstateAgent && marker.realEstateAgent.email
        )
        .map((marker) => marker.realEstateAgent.email);

      // 이메일 리스트가 비어있지 않은 경우에만 API 호출
      if (emailList.length > 0) {
        const emailQueryString = emailList.join(",");
        axios
          .get(
            `/api/map/callAgentState?email=${encodeURIComponent(
              emailQueryString
            )}`
          )
          .then((resp) => {
            // 매너온도 데이터를 배열로 변환하여 상태 업데이트
            const tempData = resp.data.map((agent) => ({
              email: agent.email,
              mannersTemperature: agent.manners_temperature,
            }));
            setMannersTemperatureList(tempData);

            mannersTemperatureList.forEach((item) => { });
          })
          .catch((err) => {
            console.log("API 호출 오류:", err);
          });
      }
    }
  }, [markersInBounds]);

  function getMannersTemperature(email) {
    if (email) {
      const matchingAgent = mannersTemperatureList.find(
        (agent) => mannersTemperatureList.email === email
      );
      return matchingAgent ? matchingAgent.mannersTemperature : "";
    }
  }

  // 정렬 토글 기능
  const [sortName, setSortName] = useState("manner");

  const handleSortBy = () => {
    // 현재 sortName을 확인하고 토글
    if (sortName === "manner") {
      setSortName("estateId");
    } else {
      setSortName("manner");
    }
  };

  return (
    <div className={style.list_main}>
      <div className={style.list_cnt}>
        {zoomLevel <= 9 ? (
          <div>지역 목록 {markerSize ? `${markerSize}개` : ""}</div>
        ) : (
          <div>지도를 확대해주세요.</div>
        )}
        <span className={style.unit_change}>
          {sortName === "manner" ? (
            <div onClick={handleSortBy}><img src={rotateNew}></img></div>
          ) : (
            <div onClick={handleSortBy}><img src={rotateManner}></img></div>
          )}
        </span>
      </div>

      {zoomLevel <= 9 ? (
        sortName === "manner" ? (
          <div className={style.list_default_size}>
            {listReady &&
              (markersInBounds && markersInBounds.length > 0 ? (
                markersInBounds
                  .slice()
                  .sort(
                    (a, b) =>
                      b.realEstateAgent.manners_temperature -
                      a.realEstateAgent.manners_temperature
                  )
                  .map((marker, index) => (
                    <div
                      key={index}
                      className={style.list_box}
                      onClick={() => handleMarkerClick(marker)}
                    >
                      <div className={style.list_box_img}>
                        {marker.images &&
                          marker.images.length > 0 &&
                          marker.images[0].sysName && (
                            <img
                              src={` https://storage.googleapis.com/daebbang/estateImages/${marker.images[0].sysName}`}
                              alt="Estate"
                            />
                          )}
                      </div>

                      <div className={style.list_box_text}>
                        <div className={style.list_box_top}>
                          {marker.realEstateAgent.manners_temperature &&
                            marker.realEstateAgent.manners_temperature >=
                            40 && (
                              <span
                                style={{ fontWeight: "bold" }}
                                className={style.recommend}
                              >
                                추천
                              </span>
                            )}
                          {marker.structure.structureType}
                          {marker.structureType}
                        </div>
                        <div className={style.list_title}>
                          {marker.transaction.transactionType}{" "}
                          {marker.deposit === 0
                            ? `${formatPrice(marker.price)}`
                            : `${formatPrice(marker.deposit)} / ${formatPrice(
                              marker.price
                            )}`}
                        </div>
                        <div className={style.list_subtitle}>
                          {marker.area}평{" · "}
                          {marker.roomFloors === -1
                            ? "반지하"
                            : marker.roomFloors === 0
                              ? "옥탑"
                              : `${marker.roomFloors}층`}
                        </div>
                        <div className={style.list_subtitle}>
                          {marker.address2}
                        </div>
                        <div className={style.list_simple}>{marker.title}</div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className={style.noData}>
                  <div className={style.noData_content}>
                    <div>
                      <img
                        src={emptyBox}
                        style={{
                          height: "40px",
                          width: "40px",
                          marginBottom: "7px",
                        }}
                      ></img>
                    </div>
                    <div
                      className={style.message_content_text}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      검색조건에 맞는 방이 없습니다.
                    </div>
                    <div className={style.message_content_text}>
                      지도를 움직이거나, 필터를 재설정 해보세요.
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className={style.list_default_size}>
            {listReady &&
              (markersInBounds && markersInBounds.length > 0 ? (
                markersInBounds
                  .slice()
                  .sort((a, b) => b.estateId - a.estateId)
                  .map((marker, index) => (
                    <div
                      key={index}
                      className={style.list_box}
                      onClick={() => handleMarkerClick(marker)}
                    >
                      <div className={style.list_box_img}>
                        {marker.images &&
                          marker.images.length > 0 &&
                          marker.images[0].sysName && (
                            <img
                              src={` https://storage.googleapis.com/daebbang/estateImages/${marker.images[0].sysName}`}
                              alt="Estate"
                            />
                          )}
                      </div>

                      <div className={style.list_box_text}>
                        <div className={style.list_box_top}>
                          {marker.realEstateAgent.manners_temperature &&
                            marker.realEstateAgent.manners_temperature >=
                            40 && (
                              <span
                                style={{ fontWeight: "bold" }}
                                className={style.recommend}
                              >
                                추천
                              </span>
                            )}
                          {marker.structure.structureType}
                          {marker.structureType}
                        </div>
                        <div className={style.list_title}>
                          {marker.transaction.transactionType}{" "}
                          {marker.deposit === 0
                            ? `${formatPrice(marker.price)}`
                            : `${formatPrice(marker.deposit)} / ${formatPrice(
                              marker.price
                            )}`}
                        </div>
                        <div className={style.list_subtitle}>
                          {marker.area}평{" · "}
                          {marker.roomFloors === -1
                            ? "반지하"
                            : marker.roomFloors === 0
                              ? "옥탑"
                              : `${marker.roomFloors}층`}
                        </div>
                        <div className={style.list_subtitle}>
                          {marker.address2}
                        </div>
                        <div className={style.list_simple}>{marker.title}</div>
                      </div>
                    </div>
                  ))
              ) : (
                <div className={style.noData}>
                  <div className={style.noData_content}>
                    <div>
                      <img
                        src={emptyBox}
                        style={{
                          height: "40px",
                          width: "40px",
                          marginBottom: "7px",
                        }}
                      ></img>
                    </div>
                    <div
                      className={style.message_content_text}
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "2px",
                      }}
                    >
                      검색조건에 맞는 방이 없습니다.
                    </div>
                    <div className={style.message_content_text}>
                      지도를 움직이거나, 필터를 재설정 해보세요.
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )
      ) : (
        <div className={style.message}>
          <div className={style.message_content}>
            <div>
              <img
                src={plzZoom}
                style={{ height: "40px", width: "40px", marginBottom: "7px" }}
              ></img>
            </div>
            <div className={style.message_content_text}>
              원룸 매물을 보려면 지도를 더 확대해주세요.
            </div>
          </div>
        </div>
      )}

      {/* {zoomLevel <= 9 ? (
        <div className={style.list_default_size}>
          {listReady &&
            (markersInBounds && markersInBounds.length > 0 ? (
              markersInBounds
                .slice()
                .sort(
                  (a, b) =>
                    b.realEstateAgent.manners_temperature -
                    a.realEstateAgent.manners_temperature
                )
                .map((marker, index) => (
                  <div
                    key={index}
                    className={style.list_box}
                    onClick={() => handleMarkerClick(marker)}
                  >
                    <div className={style.list_box_img}>
                      {marker.images &&
                        marker.images.length > 0 &&
                        marker.images[0].sysName && (
                          <img
                            src={`/uploads/estateImages/${marker.images[0].sysName}`}
                            alt="Estate"
                          />
                        )}
                    </div>

                    <div className={style.list_box_text}>
                      <div className={style.list_box_top}>
                        {marker.realEstateAgent.manners_temperature &&
                          marker.realEstateAgent.manners_temperature >=
                            40 && (
                            <span
                              style={{ fontWeight: "bold" }}
                              className={style.recommend}
                            >
                              추천
                            </span>
                          )}
                        {marker.structure.structureType}
                        {marker.structureType}
                      </div>
                      <div className={style.list_title}>
                        {marker.transaction.transactionType}{" "}
                        {marker.deposit === 0
                          ? `${formatPrice(marker.price)}`
                          : `${formatPrice(marker.deposit)} / ${formatPrice(
                              marker.price
                            )}`}
                      </div>
                      <div className={style.list_subtitle}>
                        {marker.area}평{" · "}
                        {marker.roomFloors === -1
                          ? "반지하"
                          : marker.roomFloors === 0
                          ? "옥탑"
                          : `${marker.roomFloors}층`}
                      </div>
                      <div className={style.list_subtitle}>
                        {marker.address2}
                      </div>
                      <div className={style.list_simple}>{marker.title}</div>
                    </div>
                  </div>
                ))
            ) : (
              <div className={style.noData}>
                <div className={style.noData_content}>
                  <div>
                    <img
                      src={emptyBox}
                      style={{
                        height: "40px",
                        width: "40px",
                        marginBottom: "7px",
                      }}
                    ></img>
                  </div>
                  <div
                    className={style.message_content_text}
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "2px",
                    }}
                  >
                    검색조건에 맞는 방이 없습니다.
                  </div>
                  <div className={style.message_content_text}>
                    지도를 움직이거나, 필터를 재설정 해보세요.
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className={style.message}>
          <div className={style.message_content}>
            <div>
              <img
                src={plzZoom}
                style={{ height: "40px", width: "40px", marginBottom: "7px" }}
              ></img>
            </div>
            <div className={style.message_content_text}>
              원룸 매물을 보려면 지도를 더 확대해주세요.
            </div>
          </div>
        </div>
      )} */}

      <Routes>
        <Route path="info" element={<Info />} />
      </Routes>
    </div>
  );
}

export default List;
