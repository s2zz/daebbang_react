import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import VisitorLine from './statics/VisitorLine';
import NewEstateLine from './statics/NewEstateLine';
import NewMemberLine from './statics/NewMemberLine';
const AdminMain = () => {
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


    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                const dailyVisitors = await axios.get("/api/admin/dailyVisitors");
                setvisitorCount1(dailyVisitors.data.visitorCount1 || 0);

                const allVisitors = await axios.get("/api/admin/visitors/getAll");
                const visitorData = allVisitors.data.map(entry => ({
                    x: entry.visitorDate,
                    y: entry.visitorCount1
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
                setnewMemberCount1(dailyMember.data.newMemberCount1 || 0);

                const newMembers = await axios.get("/api/admin/newMember/getAll");
                const newMemberData = newMembers.data.map(entry => ({
                    x: entry.newMemberDate,
                    y: entry.newMemberCount1
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

    return (
        <div style={{ paddingTop: '3%', paddingLeft: '2%' }}>
            <div style={{ fontSize: '2.5rem', marginLeft: '2%' }}>관리자 메인 페이지</div>
            {visitorCount1 !== null ? (
                <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                    <div>
                        <div>오늘 방문자 수</div>
                        <div style={{ fontSize: '1.5rem' }}>{visitorCount1}</div>
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        <div>누적 방문자 수</div>
                        <div style={{ fontSize: '1.5rem' }}>{sumvisitorCount1}</div>
                    </div>
                </div>

            ) : (
                <p>Loading...</p>
            )}
            <div style={{ border: '1px solid #eeeeee', width: '90%', height: '400px', margin: 'auto', marginTop: '1%'}}>
                <VisitorLine data={visitorCount1Data} />
            </div>

            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div>
                    <div>오늘 신규 회원 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{newMemberCount1}</div>
                </div>
                <div style={{ marginLeft: '5%' }}>
                    <div>누적 회원 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{sumnewMemberCount1}</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%' }}>
                <NewMemberLine data={newMemberCount1Data} />
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div>
                    <div>오늘 신규 공인중개사 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{newEstateCount1}</div>
                </div>
                <div style={{ marginLeft: '5%' }}>
                    <div>누적 공인중개사 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{sumnewEstateCount1}</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%', marginBottom: '2%' }}>
                <NewEstateLine data={newEstateCount1Data} />
            </div>
        </div>

    );
}



export default AdminMain;