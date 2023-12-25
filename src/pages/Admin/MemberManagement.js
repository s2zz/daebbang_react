import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
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
          console.log(`Approval ${enabled ? 'revoked' : 'successful'} for ${id}`);
          // 데이터를 다시 가져와서 화면을 업데이트
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
    { field: 'id', headerName: 'ID', width: 90, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: 'Name', width: 120, headerAlign: 'center', align: 'center' },
    { field: 'phone', headerName: 'Phone', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', width: 170, headerAlign: 'center', align: 'center' },
    { field: 'address1', headerName: 'Address', width: 220, headerAlign: 'center', align: 'center' },
    { field: 'role', headerName: 'Role', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'enabled', headerName: 'Enabled', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'approval',
      headerName: 'Authority',
      headerAlign: 'center',
      align: 'center',
      width: 150,
      renderCell: (params) => approvalButton(params.row.id, params.row.enabled),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      headerAlign: 'center',
      align: 'center',
      width: 110,
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
          />
        </div>
      )}
    </Box>
  );
};

export default MemberManagement;
