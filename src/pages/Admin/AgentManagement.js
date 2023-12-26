import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import Loading from '../commons/Loading';

const AgentManagement = () => {
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/admin/agent/getAll');
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
    const confirmationMessage = enabled ? '권한 취소 하시겠습니까?' : '권한 부여 하시겠습니까?';
    const confirmed = window.confirm(confirmationMessage);
    
    if (confirmed) {
      const endpoint = enabled
        ? `/api/admin/agent/revoke-approval/${email}`
        : `/api/admin/agent/approve/${email}`;

      const approvalStatus = enabled ? false : true;

      axios.put(endpoint, { enabled: approvalStatus })
        .then((response) => {
          console.log(`Approval ${enabled ? 'revoked' : 'successful'} for ${email}`);
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
  
  const approvalButton = (email, enabled) => (
    <Button
      variant="outlined"
      color={enabled ? 'secondary' : 'primary'}
      onClick={() => handleApproval(email, enabled)}
    >
      {enabled ? '권한 취소' : '권한 부여'}
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
    { field: 'email', headerName: 'Email', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estateName', headerName: 'EstateName', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estateNumber', headerName: 'EstateNumber', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: 'Name', width: 90, headerAlign: 'center', align: 'center' },
    { field: 'phone', headerName: 'Phone', width: 110, headerAlign: 'center', align: 'center' },
    { field: 'manners_temperature', headerName: 'Manners_temperature', width: 200, headerAlign: 'center', align: 'center' },
    { field: 'role', headerName: 'Role', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'enabled', headerName: 'Enabled', width: 80, headerAlign: 'center', align: 'center' },
    {
        field: 'approval',
        headerName: 'Authority',
        headerAlign: 'center',
        align: 'center',
        width: 120,
        renderCell: (params) => approvalButton(params.row.email, params.row.enabled),
      },
    {
      field: 'delete',
      headerName: 'Delete',
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

export default AgentManagement;