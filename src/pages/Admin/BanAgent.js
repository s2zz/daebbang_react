import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import Loading from '../commons/Loading';

const BanAgent = () => {
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/agent/ban');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };




  const handleDelete = async (email) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
  
    if (confirmDelete) {
      try {
        await axios.delete(`/api/admin/agent/delete/${email}`);
        const updatedContacts = contacts.filter((contact) => contact.email !== email);
        setContacts(updatedContacts);
      } catch (error) {
        console.error('Error deleting data: ', error);
      }
    }
  };

  const deleteButton = (email) => (
    <Button variant="outlined" color="error" onClick={() => handleDelete(email)}>
      삭제
    </Button>
  );

  const handleApproval = (email, enabled) => {
    const confirmationMessage = enabled ? '정지 취소 하시겠습니까?' : '정지 하시겠습니까?';
    const confirmed = window.confirm(confirmationMessage);
    
    if (confirmed) {
        if(enabled){
            axios.put(`/api/admin/agent/revoke-approval/${email}`)
            .then((response) => {
              fetchData();
            })
            .catch((error) => {
              console.error(`Error while ${enabled ? 'revoking approval' : 'approving'}:`, error);
            });

            axios.delete(`/api/admin/agent/ban/delete/${email}`)
            .then((response) => {
              fetchData();
              alert("정지 및 관련 매물 삭제되었습니다.");
            })
            .catch((error) => {
              console.error(`Error while ${enabled ? 'revoking approval' : 'approving'}:`, error);
            });
        }else{
            axios.put(`/api/admin/agent/approve/${email}`)
            .then((response) => {
              fetchData();
            })
            .catch((error) => {
              console.error(`Error while ${enabled ? 'revoking approval' : 'approving'}:`, error);
            });
        }
    } else {
      console.log('Approval action cancelled');
    }
  };
  
  const approvalButton = (email, enabled) => (
    <Button
      variant="outlined"
      color={enabled ? 'secondary' : 'primary'}
      onClick={() => handleApproval(email, enabled)}
    >
      {enabled ? '정지' : '정지 취소'}
    </Button>
  );

  const toggleEnabled = (email) => {
    const updatedContacts = contacts.map((contact) => {
      if (contact.email === email) {
        return { ...contact, enabled: !contact.enabled };
      }
      return contact;
    });

    setContacts(updatedContacts);
  };
  const columns = [
    { field: 'email', headerName: '이메일', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estateName', headerName: '이름', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estateNumber', headerName: '법인등록번호', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: '이름', width: 90, headerAlign: 'center', align: 'center' },
    { field: 'phone', headerName: '전화번호', width: 130, headerAlign: 'center', align: 'center' },
    { field: 'manners_temperature', headerName: '매너온도', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'report_Count', headerName: '경고횟수', width: 80, headerAlign: 'center', align: 'center' },
    { field: 'signupDate', headerName: '가입날짜', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'enabled', headerName: '허용 여부', width: 80, headerAlign: 'center', align: 'center' },
    {
        field: 'approval',
        headerName: '정지',
        headerAlign: 'center',
        align: 'center',
        width: 120,
        renderCell: (params) => approvalButton(params.row.email, params.row.enabled),
      },
    {
      field: 'delete',
      headerName: '삭제',
      headerAlign: 'center',
      align: 'center',
      width: 120,
      renderCell: (params) => deleteButton(params.row.email),
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
            // rowsPerPageOptions={[10, 20, 50]}
            getRowId={(row) => row.email}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default BanAgent;