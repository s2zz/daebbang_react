import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line'
const AdminMain = () => {
    const [visitorCount, setVisitorCount] = useState(null);
    const [visitorCountData, setVisitorCountData] = useState([]);
    const [visitorDateData, setVisitorDateData] = useState([]);
    const [newMemberCountData, setNewMemberCountData] = useState([]);
    const [newMemberDateData, setNewMemberDateData] = useState([]);
    const [newEstateCountData, setNewEstateCountData] = useState([]);
    const [newEstateDateData, setNewEstateDateData] = useState([]);
    const [sumVisitorCount, setSumVisitorCount] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dailyVisitors = await axios.get("/api/admin/dailyVisitors");
                setVisitorCount(dailyVisitors.data.visitorCount);

                const allVisitors = await axios.get("/api/admin/visitors/getAll");
                const visitorData = allVisitors.data.map(entry => ({
                    x: entry.visitorDate,
                    y: entry.visitorCount
                }));
                setVisitorCountData(visitorData);
                setVisitorDateData(allVisitors.data.map(entry => entry.date));

                const newMembers = await axios.get("/api/admin/newMember/getAll");
                const newMemberData = newMembers.data.map(entry => ({
                    x: entry.newMemberDate,
                    y: entry.newMemberCount
                }));
                setNewMemberCountData(newMemberData);
                setNewMemberDateData(newMembers.data.map(entry => entry.date));

                const newEstates = await axios.get("/api/admin/agent/newEstate/getAll");
                const newEstateData = newEstates.data.map(entry => ({
                    x: entry.estateDate,
                    y: entry.estateCount
                }));
                setNewEstateCountData(newEstateData);
                setNewEstateDateData(newEstates.data.map(entry => entry.date));

                const sumVisitors = await axios.get("/api/admin/visitors/sum");
                setSumVisitorCount(sumVisitors.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData(); // 초기 호출

        const interval = setInterval(fetchData, 5000); // 5초마다 호출

        return () => clearInterval(interval); // 언마운트 시 clearInterval 호출
    }, []);

    return (
        <div style={{ paddingTop: '2%' }}>
            <div style={{ fontSize: '2.5rem', marginLeft: '2%' }}>관리자 메인페이지</div>
            {visitorCount !== null ? (
                <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                    <div>
                        <div>오늘 방문수</div>
                        <div style={{ fontSize: '1.5rem' }}>{visitorCount}</div>
                    </div>
                    <div style={{ marginLeft: '5%' }}>
                        <div>누적 방문수</div>
                        <div style={{ fontSize: '1.5rem' }}>{sumVisitorCount}</div>
                    </div>
                </div>

            ) : (
                <p>Loading...</p>
            )}
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%' }}>
                <VisitorLine data={visitorCountData} />
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div >
                    <div>신규 현황</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%' }}>
                <NewMemberLine data={newMemberCountData} />
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", margin: 'auto', marginTop: '2%', display: 'flex', padding: '2%' }}>
                <div >
                    <div>신규 공인중개사 현황</div>
                </div>
            </div>
            <div style={{ border: '1px solid #eeeeee', width: "90%", height: '400px', margin: 'auto', marginTop: '1%' ,marginBottom:'2%'}}>
                <NewEstateLine data={newEstateCountData} />
            </div>
        </div>

    );
}
const VisitorLine = ({ data }) => (
    <ResponsiveLine
        data={[{ id: '방문수', data }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.0f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '방문일자',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '방문수',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)
const NewMemberLine = ({ data }) => (
    <ResponsiveLine
        data={[{ id: '신규 회원수', data }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.0f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '신규 등록일자',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '신규 회원수',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)
const NewEstateLine = ({ data }) => (
    <ResponsiveLine
        data={[{ id: '신규 공인중개자수', data }]}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: true,
            reverse: false
        }}
        yFormat=" >-.0f"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '신규 공인중개사 등록일자',
            legendOffset: 36,
            legendPosition: 'middle'
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '신규 공인중개사수',
            legendOffset: -40,
            legendPosition: 'middle'
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)
export default AdminMain;