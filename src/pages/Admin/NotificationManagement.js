import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import Loading from '../commons/Loading';
import axios from 'axios';
import style from "./MemberManagement.module.css";

const Notification = () => {
    const [page, setPage] = React.useState(1);
    const pageSize = 10;
    const [totalRows, setTotalRows] = React.useState(0);
    const [contacts, setContacts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/reviewApproval/selectByAdmin');
            setContacts(response.data);
            setTotalRows(response.data.length);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };

    const generateData = (page) => {
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, totalRows);
        return contacts.slice(startIndex, endIndex);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    //최종 반려
    const handleFinalReturn = (seq, approvalCode) => {
        const confirmationMessage = approvalCode === 'a4' ? '최종 반려 취소하시겠습니까?' : '최종 반려하시겠습니까?';
        const confirmReturn = window.confirm(confirmationMessage);

        if (confirmReturn) {
            const updatedContacts = contacts.map((contact) => {
                if (contact.seq === seq) {
                    return { ...contact, approvalCode: approvalCode === 'a4' ? 'a2' : 'a4' };
                }
                return contact;
            });
            setContacts(updatedContacts); // 상태 변경

            const endpoint = approvalCode === 'a4'
                ? `/api/admin/reviewApproval/revoke-approval/${seq}` // 반려 취소
                : `/api/admin/reviewApproval/finalBack/${seq}`; // 반려
            const newApprovalCode = approvalCode === 'a2' ? 'a4' : 'a2';
            axios.put(endpoint, { approvalCode: newApprovalCode })
                .then((response) => {
                    fetchData();
                })
                .catch((error) => {
                    console.error(`Error while ${approvalCode === 'a4' ? 'returning' : 'revoking return'}:`, error);
                });
        } else {
            console.log('Return action cancelled');
        }
    };
    //반려
    const handleReturn = (seq, approvalCode) => {
        const confirmationMessage = approvalCode === 'b1' ? '반려 취소하시겠습니까?' : '반려하시겠습니까?';
        const confirmReturn = window.confirm(confirmationMessage);

        if (confirmReturn) {
            const updatedContacts = contacts.map((contact) => {
                if (contact.seq === seq) {
                    return { ...contact, approvalCode: approvalCode === 'b1' ? 'a2' : 'b1' };
                }
                return contact;
            });
            setContacts(updatedContacts); // 상태 변경

            const endpoint = approvalCode === 'b1'
                ? `/api/admin/reviewApproval/revoke-approval/${seq}` // 반려 취소
                : `/api/admin/reviewApproval/return/${seq}`; // 반려
            const newApprovalCode = approvalCode === 'a2' ? 'b1' : 'a2';
            axios.put(endpoint, { approvalCode: newApprovalCode })
                .then((response) => {
                    fetchData();
                })
                .catch((error) => {
                    console.error(`Error while ${approvalCode === 'b1' ? 'returning' : 'revoking return'}:`, error);
                });
        } else {
            console.log('Return action cancelled');
        }
    };

    const handleApproval = (seq, approvalCode) => {
        const confirmationMessage = approvalCode === 'a2' ? '승인하시겠습니까?' : '승인을 취소하시겠습니까?';
        const confirmed = window.confirm(confirmationMessage);

        if (confirmed) {
            const endpoint = approvalCode === 'a2'
                ? `/api/admin/reviewApproval/approval/${seq}`
                : `/api/admin/reviewApproval/revoke-approval/${seq}`;

            const newApprovalCode = approvalCode === 'a2' ? 'a3' : 'a2';

            axios.put(endpoint, { approvalCode: newApprovalCode })
                .then((response) => {
                    fetchData();
                })
                .catch((error) => {
                    console.error(`Error while ${approvalCode === 'a2' ? 'approving' : 'revoking'}:`, error);
                });
        } else {
            console.log('Approval action cancelled');
        }
    };


    const approvalButton = (seq, approvalCode) => (
        <Button
            variant="outlined"
            color={approvalCode === 'a2' ? 'primary' : 'secondary'}
            onClick={() => handleApproval(seq, approvalCode)}
            disabled={approvalCode === 'b1' || approvalCode === 'a4'}
        >
            {approvalCode === 'a2' ? '승인' : '승인 취소'}
        </Button>
    );

    const returnButton = (seq, approvalCode) => (
        <Button
            variant="outlined"
            color={approvalCode === 'b1' ? 'primary' : 'secondary'}
            onClick={() => handleReturn(seq, approvalCode)}
            disabled={approvalCode === 'a4'}
        >
            {approvalCode === 'b1' ? '반려 취소' : '반려'}
        </Button>
    );
    const finalreturnButton = (seq, approvalCode) => (
        <Button
            variant="outlined"
            color={approvalCode === 'a4' ? 'primary' : 'secondary'}
            onClick={() => handleFinalReturn(seq, approvalCode)}
        >
            {approvalCode === 'a4' ? '최종 반려 취소' : '최종 반려'}
        </Button>
    );

    const toggleEnabled = (seq) => {
        const updatedContacts = contacts.map((contact) => {
            if (contact.seq === seq) {
                return { ...contact, approvalCode: !contact.approvalCode };
            }
            return contact;
        });

        setContacts(updatedContacts); // 변경된 부분입니다.
    };
    const getApprovalStatus = (approvalCode) => {
        switch (approvalCode) {
            case 'a1':
                return '미결';
            case 'a2':
                return '공인중개사_승인';
            case 'a3':
                return '관리자_승인';
            case 'a4':
                return '최종_반려';
            case 'a5':
                return '리뷰_작성_완료';
            case 'b1':
                return '관리자_반려';
            default:
                return '';
        }
    };
    
    const columns = [
        { field: 'seq', headerName: '번호', width: 90, headerAlign: "center", align: "center" },
        {
            field: 'estateName',
            headerName: '중개사무소',
            width: 250,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.estate.realEstateAgent?.estateName || '',
        },
        { field: 'userId', headerName: '사용자', width: 120, headerAlign: "center", align: "center" },
        {
            field: 'estateCode',
            headerName: '매물번호',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.estate?.estateId|| '',
        },
        {
            field: 'approvalCode',
            headerName: '승인상태',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const approvalStatus = getApprovalStatus(params.row.approvalCode);
                return <span>{approvalStatus}</span>;
            },
        },
        {
            field: 'approval',
            headerName: '승인여부',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            renderCell: (params) => approvalButton(params.row.seq, params.row.approvalCode),
        },
        { field: 'return', headerName: '반려여부', headerAlign: "center", align: "center", width: 100, renderCell: (params) => { return returnButton(params.row.seq, params.row.approvalCode); }, },
        { field: 'finalback', headerName: '최종반려여부', headerAlign: "center", align: "center", width: 150, renderCell: (params) => { return finalreturnButton(params.row.seq, params.row.approvalCode); }, }

    ];

    return (
        <div className={style.container}>
            <Box sx={{ width: '100%' }}>
                {loading ? (
                    <Loading></Loading>
                ) : (
                    <DataGrid
                        autoHeight
                        pagination
                        pageSize={pageSize}
                        rowsPerPageOptions={[pageSize]}
                        rowCount={totalRows}
                        onPageChange={(newPage) => handlePageChange(newPage)}
                        columns={columns}
                        rows={generateData(page)}
                        pageSizeOptions={[10, 50, 100]}
                        getRowId={(row) => row.seq}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                    />
                )}
            </Box>
        </div>
    );
};
export default Notification;