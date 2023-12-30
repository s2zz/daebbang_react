import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import Loading from '../commons/Loading';
const EstateManagement = () => {
    const [contacts, setContacts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/admin/estate/selectAll');
            console.log(response.data);
            setContacts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };
    const handleDelete = async (estateId) => {
        const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
      
        if (confirmDelete) {
          try {
            await axios.delete(`/api/admin/estate/delete/${estateId}`);
            const updatedContacts = contacts.filter((contact) => contact.estateId !== estateId);
            setContacts(updatedContacts);
          } catch (error) {
            console.error('Error deleting data: ', error);
          }
        }
      };
    const deleteButton = (estateId) => (
        <Button variant="outlined" color="error" onClick={() => handleDelete(estateId)}>
          삭제
        </Button>
      );
    const columns = [
        { field: 'estateId', headerName: '매물번호', width: 90, headerAlign: 'center', align: 'center' },
        { field: 'address2', headerName: '주소', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'title', headerName: '제목', width: 150, headerAlign: 'center', align: 'center' },
        {
            field: 'estateName',
            headerName: '중개사무소',
            width: 200,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.realEstateAgent?.estateName || '',
        },
        {
            field: 'phone',
            headerName: '전화번호',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.realEstateAgent?.phone || '',
        },
        {
            field: 'roomType',
            headerName: '방 정보',
            width: 90,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.room?.roomType || '',
        },
        {
            field: 'transactionType',
            headerName: '방 정보2',
            width: 90,
            headerAlign: 'center',
            align: 'center',
            valueGetter: (params) => params.row.transaction?.transactionType || '',
        },
        { field: 'writeDate', headerName: '등록날짜', width: 200, headerAlign: 'center', align: 'center' },
        {
            field: 'delete',
            headerName: '삭제',
            headerAlign: 'center',
            align: 'center',
            width: 100,
              renderCell: (params) => deleteButton(params.row.estateId),
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
                        pageSize={contacts.length} // 페이지 사이즈를 데이터 길이로 설정
                        rowsPerPageOptions={[contacts.length]} // 페이지 옵션도 데이터 길이로 설정
                        getRowId={(row) => row.estateId}
                        slots={{
                            toolbar: GridToolbar,
                        }}
                    />
                </div>
            )}
        </Box>
    );
}
export default EstateManagement;