import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';
import style from "./MemberManagement.module.css";

const MemberManagement = () => {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [totalRows, setTotalRows] = React.useState(0);
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/member/getAll');
        console.log(response.data); // 데이터 확인용 로그
        
        setContacts(response.data);
        setTotalRows(response.data.length);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generateData = (page) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalRows);
    return contacts.slice(startIndex, endIndex);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');
  
    if (confirmDelete) {
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
      setTotalRows(updatedContacts.length);
      
      axios.delete(`/api/member/delete/${id}`);
    }
  };
  

  const deleteButton = (id) => (
    <Button variant="outlined" color="error" onClick={() => handleDelete(id)}>
      Delete
    </Button>
  );

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 ,headerAlign:"center",align:"center"},
    { field: 'name', headerName: 'Name', width: 90 ,headerAlign:"center",align:"center"},
    { field: 'phone', headerName: 'Phone', width: 110 ,headerAlign:"center",align:"center"},
    { field: 'email', headerName: 'Email', width: 150 ,headerAlign:"center",align:"center"},
    { field: 'address1', headerName: 'Address', width: 150 ,headerAlign:"center",align:"center"},
    { field: 'role', headerName: 'Role', width: 150 ,headerAlign:"center",align:"center"},
    { field: 'enabled', headerName: 'Enabled', width: 100 ,headerAlign:"center",align:"center"},
    {field: 'delete',headerName: 'Delete',headerAlign:"center",align:"center",width: 110,renderCell: (params) => {return deleteButton(params.row.id);},},
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
          pageSizeOptions={[30, 50, 100]}
        />
      )}
    </Box>
  );
};

export default MemberManagement;
