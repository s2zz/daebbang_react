import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import style from "./MemberManagement.module.css";
import Loading from '../commons/Loading';

const MemberManagement = () => {
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/getMember');
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
  
    if (confirmDelete) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
      
      axios.delete(`/api/member/delete/${id}`);
    }
  };

  const handleApproval = (id, enabled) => {
    const confirmationMessage = enabled ? '권한 취소 하시겠습니까?' : '권한 부여 하시겠습니까?';
    const confirmed = window.confirm(confirmationMessage);
    
    if (confirmed) {
      const endpoint = enabled
        ? `/api/admin/member/revoke-approval/${id}`
        : `/api/admin/member/approve/${id}`;

      const approvalStatus = enabled ? false : true;

      axios.put(endpoint, { enabled: approvalStatus })
        .then((response) => {
          fetchData();
        })
        .catch((error) => {
          console.error(`Error while ${enabled ? 'revoking approval' : 'approving'}:`, error);
        });
    } else {
      console.log('Approval action cancelled');
    }
  };

  const approvalButton = (id, enabled) => (
    <Button
      variant="outlined"
      color={enabled ? 'secondary' : 'primary'}
      onClick={() => handleApproval(id, enabled)}
    >
      {enabled ? '권한 취소' : '권한 부여'}
    </Button>
  );

  const deleteButton = (id) => (
    <Button variant="outlined" color="error" onClick={() => handleDelete(id)}>
      삭제
    </Button>
  );

  const columns = [
    { field: 'id', headerName: '아이디', width: 90, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: '이름', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'phone', headerName: '전화번호', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: '이메일', width: 170, headerAlign: 'center', align: 'center' },
    { field: 'address1', headerName: '주소', width: 300, headerAlign: 'center', align: 'center' },
    { field: 'signupDate', headerName: '가입 날짜', width: 160, headerAlign: 'center', align: 'center' },
    { field: 'enabled', headerName: '허용 여부', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'approval',
      headerName: '권한',
      headerAlign: 'center',
      align: 'center',
      width: 130,
      renderCell: (params) => approvalButton(params.row.id, params.row.enabled),
    },
    {
      field: 'delete',
      headerName: '삭제',
      headerAlign: 'center',
      align: 'center',
      width: 100,
      renderCell: (params) => deleteButton(params.row.id),
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ height: '100%', width: '100%' }}>
          <DataGrid
            autoHeight
            columns={columns}
            rows={contacts}
            pageSize={contacts.length}
            rowsPerPageOptions={[contacts.length]}
            getRowId={(row) => row.id}
            slots={{
              toolbar: GridToolbar,
            }}
          />
        </div>
      )}
    </Box>
  );
};

export default MemberManagement;
