import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
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
            const response = await axios.get('/api/reviewApproval/admin/selectByAdmin');
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
    
    const handleReturn = (seq, approvalCode) => {
        console.log(approvalCode);
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
                ? `/api/reviewApproval/admin/revoke-approval/${seq}` // 반려 취소
                : `/api/reviewApproval/admin/return/${seq}`; // 반려
                const newApprovalCode = approvalCode === 'a2' ? 'b1' : 'a2'; 
            axios.put(endpoint, { approvalCode: newApprovalCode })
                .then((response) => {
                    console.log(`Return ${approvalCode === 'b1' ? 'successful' : 'revoked'} for ${seq}`);
                    // 데이터를 다시 가져와서 화면을 업데이트
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
                ? `/api/reviewApproval/admin/approval/${seq}`
                : `/api/reviewApproval/admin/revoke-approval/${seq}`; 

            const newApprovalCode = approvalCode === 'a2' ? 'a3' : 'a2';

            axios.put(endpoint, { approvalCode: newApprovalCode })
                .then((response) => {
                    console.log(`Approval ${approvalCode === 'a2' ? 'successful' : 'revoked'} for ${seq}`);
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
            disabled={approvalCode === 'b1'}
        >
            {approvalCode === 'a2' ? '승인' : '승인 취소'}
        </Button>
    );

    const returnButton = (seq, approvalCode) => (
        <Button
            variant="outlined"
            color={approvalCode === 'b1' ? 'primary' : 'secondary'}
            onClick={() => handleReturn(seq, approvalCode)}
        >
            {approvalCode === 'b1' ? '반려 취소' : '반려'}
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

    const columns = [
        { field: 'seq', headerName: 'Seq', width: 90, headerAlign: "center", align: "center" },
        { field: 'userId', headerName: 'UserId', width: 100, headerAlign: "center", align: "center" },
        { field: 'estateName', headerName: 'estateName', width: 200, headerAlign: "center", align: "center" },
        { field: 'estateCode', headerName: 'estateCode', width: 110, headerAlign: "center", align: "center" },
        { field: 'approvalCode', headerName: 'ApprovalCode', width: 110, headerAlign: "center", align: "center" },
        {
            field: 'approval',
            headerName: 'Approval',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            renderCell: (params) => approvalButton(params.row.seq, params.row.approvalCode),
        },
        { field: 'return', headerName: 'Return', headerAlign: "center", align: "center", width: 100, renderCell: (params) => { return returnButton(params.row.seq, params.row.approvalCode); }, }

    ];

    return (
        <Box sx={{ width: '100%' }}>
            {loading ? (
                <div>Loading...</div>
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
                />
            )}
        </Box>
    );
};
export default Notification;