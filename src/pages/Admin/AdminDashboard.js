import axios from 'axios';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import style from "./AdminDashboard.module.css"
import RoomStatics from './statics/RoomStatics';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@mui/material/Pagination";
import VisitorLine from './statics/VisitorLine';
import NewEstateLine from './statics/NewEstateLine';
import NewMemberLine from './statics/NewMemberLine';
import { faRightToBracket, faUserPlus, faHome, faFileAlt } from "@fortawesome/free-solid-svg-icons";
const AdminDashboard = () => {
    //통계
    const [visitorCount1, setvisitorCount1] = useState(0);
    const [visitorCount1Data, setvisitorCount1Data] = useState([]);
    const [visitorDateData, setVisitorDateData] = useState([]);
    const [sumvisitorCount1, setSumvisitorCount1] = useState([]);

    const [newMemberCount1, setnewMemberCount1] = useState(0);
    const [newMemberCount1Data, setnewMemberCount1Data] = useState([]);
    const [newMemberDateData, setNewMemberDateData] = useState([]);
    const [sumnewMemberCount1, setSumnewMemberCount1] = useState([]);

    const [newEstateCount1, setnewEstateCount1] = useState(0);
    const [newEstateCount1Data, setnewEstateCount1Data] = useState([]);
    const [newEstateDateData, setNewEstateDateData] = useState([]);
    const [sumnewEstateCount1, setSumnewEstateCount1] = useState([]);

    const [selectedChart, setSelectedChart] = useState('visitor');
    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                const dailyVisitors = await axios.get("/api/admin/dailyVisitors");
                setvisitorCount1(dailyVisitors.data.visitorCount || 0);

                const allVisitors = await axios.get("/api/admin/visitors/getAll");
                const visitorData = allVisitors.data.map(entry => ({
                    x: entry.visitorDate,
                    y: entry.visitorCount
                }));
                setvisitorCount1Data(visitorData);
                setVisitorDateData(allVisitors.data.map(entry => entry.date));

                const sumVisitors = await axios.get("/api/admin/visitors/sum");
                setSumvisitorCount1(sumVisitors.data);
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        };

        const fetchNewMemberData = async () => {
            try {
                const dailyMember = await axios.get("/api/admin/dailyMember");
                setnewMemberCount1(dailyMember.data.newMemberCount || 0);

                const newMembers = await axios.get("/api/admin/newMember/getAll");
                const newMemberData = newMembers.data.map(entry => ({
                    x: entry.newMemberDate,
                    y: entry.newMemberCount
                }));
                setnewMemberCount1Data(newMemberData);
                setNewMemberDateData(newMembers.data.map(entry => entry.date));

                const sumNewMembers = await axios.get("/api/admin/newMember/sum");
                setSumnewMemberCount1(sumNewMembers.data);
            } catch (error) {
                console.error('Error fetching new member data:', error);
            }
        };

        const fetchNewEstateData = async () => {
            try {
                const dailyEstate = await axios.get("/api/admin/dailyEstate");
                setnewEstateCount1(dailyEstate.data.estateCount || 0);

                const newEstates = await axios.get("/api/admin/agent/newEstate/getAll");
                const newEstateData = newEstates.data.map(entry => ({
                    x: entry.estateDate,
                    y: entry.estateCount
                }));
                setnewEstateCount1Data(newEstateData);
                setNewEstateDateData(newEstates.data.map(entry => entry.date));

                const sumNewEstates = await axios.get("/api/admin/agent/sum");
                setSumnewEstateCount1(sumNewEstates.data);
            } catch (error) {
                console.error('Error fetching new estate data:', error);
            }
        };


        fetchVisitorData();
        fetchNewMemberData();
        fetchNewEstateData();

        const visitorInterval = setInterval(fetchVisitorData, 5000);
        const newMemberInterval = setInterval(fetchNewMemberData, 5000);
        const newEstateInterval = setInterval(fetchNewEstateData, 5000);

        return () => {
            clearInterval(visitorInterval);
            clearInterval(newMemberInterval);
            clearInterval(newEstateInterval);
        };
    }, []);

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
    
    const reportPageChangeHandler = (event, page) => {
        setCurrentReportPage(page);
    }
    //매물 목록
    const [estateList, setEstateList] = useState([]);



    //매물 top5
    useEffect(() => {
        axios.get(`/api/admin/topFive`)
            .then(response => {
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
                <div className={[style.box, style.option, style.hover].join(' ')} onClick={() => setSelectedChart('visitor')}>
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
                <div className={[style.box, style.option, style.hover].join(' ')} onClick={() => setSelectedChart('newMember')}>
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
                <div className={[style.box, style.option, style.hover, style.greenBottomBorder].join(' ')} onClick={() => setSelectedChart('newEstate')}>
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
                    <div className={style.bord}>
                        <div style={{ border: '1px solid #eeeeee', width: '100%', height: '300px', margin: 'auto' }}>
                            {selectedChart === 'newMember' && (
                                <NewMemberLine data={newMemberCount1Data} />
                            )}
                            {selectedChart === 'visitor' && (
                                <VisitorLine data={visitorCount1Data} />
                            )}
                            {selectedChart === 'newEstate' && (
                                <NewEstateLine data={newEstateCount1Data} />
                            )}
                        </div>
                    </div>
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
                    <table style={{ width: '100%',textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>주소</th>
                                <th>제목</th>
                                <th>정보</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '87%' }}>
                            {estateList.map(item => (
                                <tr key={item.viewId}>
                                    <td>{item.estate.estateId}</td>
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

                    <table style={{ width: '100%',textAlign: 'center' }}>
                        <thead>
                            <tr>
                                <th>매물번호</th>
                                <th>작성자</th>
                                <th>공인중개사</th>
                                <th>신고내용</th>
                                <th>날짜</th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: '85.59%' }}>
                            {slicedReportList.map(report => (
                                <tr key={report.seq}>
                                    <td>{report.estate.estateId}</td>
                                    <td>{report.writer}</td>
                                    <td>{report.realEstateAgent.estateName}</td>
                                    <td>{report.reportContents.content}</td>
                                    <td>{report.writeDate}</td>
                                </tr>
                            ))}


                        </tbody>
                    </table>
                    <div className={style.naviFooter}>
                        <Pagination
                            count={Math.ceil(reportList.length / reportCountPerPage)}
                            page={currentReportPage}
                            onChange={reportPageChangeHandler} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminDashboard;