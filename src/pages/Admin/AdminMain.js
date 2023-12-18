import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
import VisitorLine from './statics/VisitorLine';
import NewEstateLine from './statics/NewEstateLine';
import NewMemberLine from './statics/NewMemberLine';
const AdminMain = () => {
    const [visitorCount, setVisitorCount] = useState(0);
    const [visitorCountData, setVisitorCountData] = useState([]);
    const [visitorDateData, setVisitorDateData] = useState([]);
    const [sumVisitorCount, setSumVisitorCount] = useState([]);

    const [newMemberCount, setNewMemberCount] = useState(0);
    const [newMemberCountData, setNewMemberCountData] = useState([]);
    const [newMemberDateData, setNewMemberDateData] = useState([]);
    const [sumNewMemberCount, setSumNewMemberCount] = useState([]);

    const [newEstateCount, setNewEstateCount] = useState(0);
    const [newEstateCountData, setNewEstateCountData] = useState([]);
    const [newEstateDateData, setNewEstateDateData] = useState([]);
    const [sumNewEstateCount, setSumNewEstateCount] = useState([]);


    useEffect(() => {
        const fetchVisitorData = async () => {
            try {
                const dailyVisitors = await axios.get("/api/admin/dailyVisitors");
                setVisitorCount(dailyVisitors.data.visitorCount || 0);

                const allVisitors = await axios.get("/api/admin/visitors/getAll");
                const visitorData = allVisitors.data.map(entry => ({
                    x: entry.visitorDate,
                    y: entry.visitorCount
                }));
                setVisitorCountData(visitorData);
                setVisitorDateData(allVisitors.data.map(entry => entry.date));

                const sumVisitors = await axios.get("/api/admin/visitors/sum");
                setSumVisitorCount(sumVisitors.data);
            } catch (error) {
                console.error('Error fetching visitor data:', error);
            }
        };

        const fetchNewMemberData = async () => {
            try {
                const dailyMember = await axios.get("/api/admin/dailyMember");
                setNewMemberCount(dailyMember.data.newMemberCount || 0);

                const newMembers = await axios.get("/api/admin/newMember/getAll");
                const newMemberData = newMembers.data.map(entry => ({
                    x: entry.newMemberDate,
                    y: entry.newMemberCount
                }));
                setNewMemberCountData(newMemberData);
                setNewMemberDateData(newMembers.data.map(entry => entry.date));

                const sumNewMembers = await axios.get("/api/admin/newMember/sum");
                setSumNewMemberCount(sumNewMembers.data);
            } catch (error) {
                console.error('Error fetching new member data:', error);
            }
        };

        const fetchNewEstateData = async () => {
            try {
                const dailyEstate = await axios.get("/api/admin/dailyEstate");
                setNewEstateCount(dailyEstate.data.estateCount || 0);

                const newEstates = await axios.get("/api/admin/agent/newEstate/getAll");
                const newEstateData = newEstates.data.map(entry => ({
                    x: entry.estateDate,
                    y: entry.estateCount
                }));
                setNewEstateCountData(newEstateData);
                setNewEstateDateData(newEstates.data.map(entry => entry.date));

                const sumNewEstates = await axios.get("/api/admin/agent/sum");
                setSumNewEstateCount(sumNewEstates.data);
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
            <div style={{ fontSize: '2.5rem', marginLeft: '2%' }}>관리자 메인페이지</div>
            {visitorCount !== null ? (
                <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                    <div>
                        <div>오늘 방문자 수</div>
                        <div style={{ fontSize: '1.5rem' }}>{visitorCount}</div>
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        <div>누적 방문자 수</div>
                        <div style={{ fontSize: '1.5rem' }}>{sumVisitorCount}</div>
                    </div>
                </div>

            ) : (
                <p>Loading...</p>
            )}
            <div style={{ border: '1px solid #eeeeee', width: '90%', height: '400px', margin: 'auto', marginTop: '1%'}}>
                <VisitorLine data={visitorCountData} />
            </div>

            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div>
                    <div>오늘 신규 회원 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{newMemberCount}</div>
                </div>
                <div style={{ marginLeft: '5%' }}>
                    <div>누적 회원 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{sumNewMemberCount}</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%' }}>
                <NewMemberLine data={newMemberCountData} />
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div>
                    <div>오늘 신규 공인중개사 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{newEstateCount}</div>
                </div>
                <div style={{ marginLeft: '5%' }}>
                    <div>누적 공인중개사 수</div>
                    <div style={{ fontSize: '1.5rem' }}>{sumNewEstateCount}</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%', marginBottom: '2%' }}>
                <NewEstateLine data={newEstateCountData} />
            </div>
        </div>

    );
}



export default AdminMain;