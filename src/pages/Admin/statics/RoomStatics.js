import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponsivePie } from '@nivo/pie';

const RoomStatics = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/countByRoomCode')
            .then(response => {
                const data = response.data.map(item => ({
                    id: item[0].roomType,
                    value: item[1]
                }));
                setChartData(data);
            })
            .catch(error => {
                console.error('룸 데이터 에러:', error);
            });
    }, []);

    return (
        <div style={{ height: '280px' }}> {/* 높이 조절 */}
            <ResponsivePie
                data={chartData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [
                        [
                            'darker',
                            2
                        ]
                    ]
                }}
                legends={[
                    {
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 10,
                        translateY: 56,
                        itemsSpacing: 0,
                        itemWidth: 80,
                        itemHeight: 60,
                        itemTextColor: '#999',
                        itemDirection: 'left-to-right',
                        itemOpacity: 1,
                        symbolSize: 18,
                        symbolShape: 'circle',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemTextColor: '#000'
                                }
                            }
                        ],
                        itemBackground: `url(#pattern-0)` // 아이템에 따른 백그라운드 패턴 적용
                    }
                ]}
            />
        </div>
    );
}

export default RoomStatics;
