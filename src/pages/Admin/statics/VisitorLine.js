import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Button } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const VisitorLine = ({ data }) => {
    const itemsPerPage = 7;
    const [currentPage, setCurrentPage] = useState(0);

    const lastPageIndex = Math.ceil(data.length / itemsPerPage);
    const endIndex = data.length - currentPage * itemsPerPage;
    const startIndex = Math.max(0, endIndex - itemsPerPage);

    const showPreviousPage = () => {
        if (currentPage < lastPageIndex - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const showNextPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const currentData = data.slice(startIndex, endIndex);

    return (
        <div style={{ width: '100%', height: '90%' }}>
            <div style={{ position: 'relative', top: '5%', left: '3%' }}>
                <Button
                    style={{ marginRight: '2%' }}
                    color="info"
                    outline
                    onClick={showPreviousPage}
                    disabled={currentPage === lastPageIndex - 1}
                >
                    <FontAwesomeIcon icon={faChevronLeft}/>
                </Button>
                <Button
                    color="info"
                    outline
                    onClick={showNextPage}
                    disabled={currentPage === 0}
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </Button>
            </div>
            {/* 현재 페이지에 해당하는 데이터로 차트를 그립니다 */}
            <ResponsiveLine
                data={[{ id: '방문자 수', data: currentData }]}
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
                    legend: '방문자 수',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                enableSlices="x"
                enableGridX={false}
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
        </div>
    );
};

export default VisitorLine;
