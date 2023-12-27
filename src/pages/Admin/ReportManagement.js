import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import Loading from '../commons/Loading';
const ReportManagement = () => {
    const [contacts, setContacts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/report/selectAll');
            console.log(response.data);
            setContacts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };
    //삭제
    const handleDelete = async (seq) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

        if (confirmDelete) {
            try {
                await axios.delete(`/api/admin/report/delete/${seq}`);
                const updatedContacts = contacts.filter((contact) => contact.seq !== seq);
                setContacts(updatedContacts);
            } catch (error) {
                console.error('Error deleting data: ', error);
            }
        }
    };
    const deleteButton = (seq) => (
        <Button variant="outlined" color="error" onClick={() => handleDelete(seq)}>
            삭제
        </Button>
    );
    //승인
    const handleApproval = (seq, reportStatus) => {
        const confirmationMessage = reportStatus === 'rs1' ? '승인 부여 하시겠습니까?' : '승인 취소 하시겠습니까?';
        const confirmed = window.confirm(confirmationMessage);
    
        if (confirmed) {
            const endpoint = reportStatus === 'rs1'
                ? `/api/admin/estate/report/approve/${seq}`
                : `/api/admin/estate/report/revoke-approval/${seq}`;
    
            const approvalStatus = reportStatus === 'rs1' ? true : false;
    
            axios.put(endpoint, { reportStatus: approvalStatus })
                .then((response) => {
                    console.log(`승인 ${reportStatus === 'rs1' ? '완료됨' : '취소됨'}: ${seq}`);
                    fetchData();
                })
                .catch((error) => {
                    console.error(`승인 ${reportStatus === 'rs1' ? '중' : '취소 중'} 에러:`, error);
                });
        } else {
            console.log('승인 작업 취소됨');
        }
    };
    
    const approvalButton = (seq, reportStatus) => {
        const isPending = reportStatus === 'rs1';
        const buttonText = isPending ? '승인 부여' : '승인 취소';
    
        return (
            <Button
                variant="outlined"
                color={isPending ? 'primary' : 'secondary'}
                onClick={() => handleApproval(seq, reportStatus)}
            >
                {buttonText}
            </Button>
        );
    };
    
    const handleReturn = (seq, reportStatus) => {
        const confirmationMessage = reportStatus === 'rs1' || reportStatus === 'rs2' ? '거부 하시겠습니까?' : '거부 취소 하시겠습니까?';
        const confirmed = window.confirm(confirmationMessage);
    
        if (confirmed) {
            const endpoint = reportStatus === 'rs1' || reportStatus === 'rs2'
                ? `/api/admin/estate/report/reject/${seq}`
                : `/api/admin/estate/report/revoke-rejection/${seq}`;
    
            const rejectionStatus = reportStatus === 'rs1' || reportStatus === 'rs2';
    
            axios.put(endpoint, { reportStatus: rejectionStatus })
                .then((response) => {
                    console.log(`반려 ${reportStatus === 'rs1' || reportStatus === 'rs2' ? '완료됨' : '거부'}: ${seq}`);
                    fetchData();
                })
                .catch((error) => {
                    console.error(`반려 ${reportStatus === 'rs1' || reportStatus === 'rs2' ? '중' : '거부 중'} 에러:`, error);
                });
        } else {
            console.log('반려 작업 취소됨');
        }
    };
    
    const returnButton = (seq, reportStatus) => (
        <Button
            variant="outlined"
            color={reportStatus === 'rs1' || reportStatus === 'rs2' ? 'primary' : 'secondary'}
            onClick={() => handleReturn(seq, reportStatus)}
            disabled={reportStatus === 'rs3'}
        >
            {reportStatus === 'rs1' || reportStatus === 'rs2' ? '거부' : '거부 취소'}
        </Button>
    );
    
    
   


    const columns = [
        { field: 'seq', headerName: 'Seq', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'writer', headerName: 'Name', width: 90, headerAlign: 'center', align: 'center' },
        {
            field: 'estateName',
            headerName: 'EstateName',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.realEstateAgent?.estateName || '',
        },
        {
            field: 'detailContent',
            headerName: 'Content',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.reportContents?.content || '',
        },
        { field: 'content', headerName: 'DetailContent', width: 150, headerAlign: 'center', align: 'center' },
        {
            field: 'reportStatus',
            headerName: 'ReportStatus',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.reportStatus?.status || '',
        },
        { field: 'writeDate', headerName: 'Phone', width: 110, headerAlign: 'center', align: 'center' },
        {
            field: 'approval',
            headerName: 'Approval',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            renderCell: (params) => approvalButton(params.row.seq, params.row.reportStatus?.id),
        },
        {
            field: 'rejection',
            headerName: 'Rejection',
            headerAlign: 'center',
            align: 'center',
            width: 140,
            renderCell: (params) => returnButton(params.row.seq, params.row.reportStatus?.id),
        },
        {
            field: 'delete',
            headerName: 'Delete',
            headerAlign: 'center',
            align: 'center',
            width: 120,
            renderCell: (params) => deleteButton(params.row.seq),
        },
    ];
    return (
        <Box sx={{ width: '100%' }}>
            {loading ? (
                <Loading />
            ) : (
                <div style={{ height: '100%', width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={contacts}
                        pageSize={contacts.length}
                        rowsPerPageOptions={[contacts.length]}
                        getRowId={(row) => row.seq}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                    />
                </div>
            )}
        </Box>
    );
}
export default ReportManagement;