import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import style from "./AdminDashboard.module.css"
import RoomStatics from './statics/RoomStatics';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import { faRightToBracket, faUserPlus, faHome, faFileAlt } from "@fortawesome/free-solid-svg-icons";
const AdminDashboard = () => {
    //오늘
    const [visitorCount, setVisitorCount] = useState(0);
    const [newMemberCount, setNewMemberCount] = useState(0);
    const [newEstateCount, setNewEstateCount] = useState(0);
    //어제
    const [yvisitorCount, setYVisitorCount] = useState(0);
    const [ynewMemberCount, setYNewMemberCount] = useState(0);
    const [ynewEstateCount, setYNewEstateCount] = useState(0);
    //전체 매물 수
    const [countEstate, setCountEstate] = useState(0);
    const [tcountEstate, setTCountEstate] = useState(0);
    //신고
    const [reportList, setReportList] = useState([]);
    const [reportCount, setReportCount] = useState(0);
    // 신고 페이지네이션
    const [currentReportPage, setCurrentReportPage] = useState(1);
    const [reportCountPerPage] = useState(5);
    
    const slicedReportList = reportList.slice(
        (currentReportPage - 1) * reportCountPerPage,
        currentReportPage * reportCountPerPage
    );
    const processedReportList = slicedReportList.map(report => ({
        ...report,
        formattedDate: new Date(report.writeDate).toLocaleDateString(), // 원하는 날짜 형식으로 변환
      }));
    const reportPageChangeHandler = (event, page) => {
        setCurrentReportPage(page);
    }
    //매물 목록
    const [estateList, setEstateList] = useState([]);

    
    
    //매물 top5
    useEffect(() => {
        axios.get(`/api/admin/topFive`)
            .then(response => {
                console.log(response.data);
                setEstateList(response.data);
            })
            .catch(error => {

            });
    }, []);
    // 신고
    const fetchReportList = () => {
        axios.get(`/api/admin/selectAllByReportStatus`)
            .then(response => {
                console.log(response.data);
                setReportList(response.data);
            })
            .catch(error => {
                // 에러 처리
            });

        axios.get(`/api/admin/countByReportStatus`)
            .then(response => {
                console.log(response.data);
                setReportCount(response.data);
            })
            .catch(error => {
                // 에러 처리
            });
    };

    // reportList가 변경되지 않았을 때 한 번만 실행됨
    useEffect(() => {
        fetchReportList();
    }, []);

    // 페이지 변화에 따라 실행
    useEffect(() => {
        fetchReportList();
    }, [currentReportPage]);

    useEffect(() => {
        axios.get('/api/admin/dailyVisitors')
            .then(response => {
                setVisitorCount(response.data.visitorCount || 0);
            })
            .catch(error => {
                console.error('방문자 데이터 에러:', error);
            });

        axios.get('/api/admin/dailyMember')
            .then(response => {
                setNewMemberCount(response.data.newMemberCount || 0);
            })
            .catch(error => {
                console.error('신규 회원 데이터 에러:', error);
            });

        axios.get('/api/admin/dailyEstate')
            .then(response => {
                setNewEstateCount(response.data.estateCount || 0);
            })
            .catch(error => {
                console.error('신규 중개사 데이터 에러:', error);
            });

        axios.get('/api/admin/countEstate')
            .then(response => {
                setCountEstate(response.data || 0);
            })
            .catch(error => {
                console.error('전체 매물 데이터 에러:', error);
            });
        axios.get('/api/admin/countTodayEstate')
            .then(response => {
                setTCountEstate(response.data || 0);
            })
            .catch(error => {
                console.error('오늘 매물 데이터 에러:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('/api/admin/getYesterdayVisitors')
            .then(response => {
                setYVisitorCount(response.data.visitorCount || 0);
            })
            .catch(error => {
                console.error('방문자 데이터 에러:', error);
            });

        axios.get('/api/admin/getYesterdayMember')
            .then(response => {
                setYNewMemberCount(response.data.newMemberCount || 0);
            })
            .catch(error => {
                console.error('신규 회원 데이터 에러:', error);
            });

        axios.get('/api/admin/getYesterdayNewEstate')
            .then(response => {
                setYNewEstateCount(response.data.estateCount || 0);
            })
            .catch(error => {
                console.error('신규 중개사 데이터 에러:', error);
            });
    }, []);
    return (
        <div className={style.container}>
            <div className={style.title}>대시보드</div>
            <div className={style.box_container}>
                <div className={[style.box, style.option].join(' ')}>
                    <div className={style.topContents}>
                        <div>오늘 방문자 수</div>
                        <div className={style.contents}>
                            <div>{visitorCount}</div>
                            <div style={{ fontWeight: 'bolder' }} className={style.first}>{visitorCount - yvisitorCount > 0 ? `+${visitorCount - yvisitorCount}` : visitorCount - yvisitorCount}</div>
                            <div><FontAwesomeIcon className={[style.first, style.fontOption].join(' ')} icon={faRightToBracket} /></div>
                        </div>
                    </div>


                    <div className={style.blueBox}></div>
                </div>
                <div className={[style.box, style.option].join(' ')}>
                    <div className={style.topContents}>
                        <div>오늘 신규 회원 수</div>
                        <div className={style.contents}>
                            <div>{newMemberCount}</div>
                            <div style={{ fontWeight: 'bolder' }} className={style.sec}>{newMemberCount - ynewMemberCount > 0 ? `+${newMemberCount - ynewMemberCount}` : newMemberCount - ynewMemberCount}</div>
                            <div><FontAwesomeIcon className={[style.sec, style.fontOption].join(' ')} icon={faUserPlus} /></div>
                        </div>
                    </div>
                    <div className={style.redBox}></div>
                </div>
                <div className={[style.box, style.option, style.greenBottomBorder].join(' ')}>
                    <div className={style.topContents}>
                        <div>오늘 신규 중개사 수</div>
                        <div className={style.contents}>
                            <div>{newEstateCount}</div>
                            <div style={{ fontWeight: 'bolder' }} className={style.third}>{newEstateCount - ynewEstateCount > 0 ? `+${newEstateCount - ynewEstateCount}` : newEstateCount - ynewEstateCount}</div>
                            <div><FontAwesomeIcon className={[style.third, style.fontOption].join(' ')} icon={faHome} /></div>
                        </div>
                    </div>
                    <div className={style.greenBox}></div>
                </div>
                <div className={[style.box, style.option, style.yellowBottomBorder].join(' ')}>
                    <div className={style.topContents}>
                        <div>총 매물 수</div>
                        <div className={style.contents}>
                            <div>{countEstate}</div>
                            <div style={{ fontWeight: 'bolder' }} className={style.for}><div>{tcountEstate > 0 ? `+${tcountEstate}` : tcountEstate}</div></div>
                            <div><FontAwesomeIcon className={[style.for, style.fontOption].join(' ')} icon={faFileAlt} /></div>
                        </div>
                    </div>
                    <div className={style.yellowBox}></div>
                </div>
            </div>
            <div className={style.center_box_container}>
                <div className={[style.left_content, style.option].join(' ')}>
                    <div className={style.bord}>??</div>
                </div>
                <div className={[style.right_content, style.option].join(' ')}>
                    <div className={style.bord}>원룸/투룸</div>
                    <div><RoomStatics /></div>
                </div>
            </div>
            <div className={style.bottom_box_container}>
                <div className={[style.left_bottom_content, style.option].join(' ')}>
                    <div className={style.best}>
                        <div className={style.bord}> 인기 매물 TOP5</div>
                        <Link to="/admin/toEstateManagement"><button className={style.morebtn}>더보기</button></Link>
                    </div>
                    <hr style={{ marginTop: '2.5%' }}></hr>
                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>주소</th>
                                <th>제목</th>
                                <th>정보</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '15px' }}>
                            {estateList.map(item => (
                                <tr key={item.viewId}>
                                    <td style={{ textAlign: 'center' }}>{item.estate.estateId}</td>
                                    <td>{item.estate.address2}</td>
                                    <td>{item.estate.title}</td>
                                    <td>{item.estate.room.roomType}</td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                </div>
                <div className={[style.right_bottom_content, style.option].join(' ')}>
                    <div className={style.best}>
                        <div style={{ display: 'flex' }}>
                            <div className={style.bord}>
                                신고 내역
                            </div>
                            {reportCount !== null && reportCount !== undefined && (
                                <div style={{ marginLeft: '10px', color: 'red' }}>{reportCount}</div>
                            )}
                        </div>

                        <Link to="/admin/toReportManagement"><button className={style.morebtn}>더보기</button></Link>
                    </div>
                    <hr style={{ marginTop: '1.3%' }}></hr>

                    <table style={{ width: '100%' }}>
                        <thead>
                            <tr>
                                <th>매물번호</th>
                                <th>작성자</th>
                                <th>공인중개사</th>
                                <th>신고내용</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '15px' }}>
                            {processedReportList.map(report => (
                                <tr key={report.seq}>
                                    <td tyle={{ textAlign: 'center' }}>{report.estate_id}</td>
                                    <td>{report.writer}</td>
                                    <td>{report.taker}</td>
                                    <td>{report.contents_code}</td>
                                    <td>{report.formattedDate}</td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                    <div className={style.naviFooter}>
                        <Pagination
                            count={Math.ceil(reportList.length / reportCountPerPage)}
                            page={currentReportPage}
                            onChange={reportPageChangeHandler} // Update currentReportPage on change
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;