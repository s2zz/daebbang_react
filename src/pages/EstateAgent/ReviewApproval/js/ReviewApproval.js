import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import axios from 'axios';

const ReviewApproval = () => {
  const [page, setPage] = React.useState(1);
  const pageSize = 10;
  const [totalRows, setTotalRows] = React.useState(0);
  const [contacts, setContacts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const columns = [
    { field: 'seq', headerName: 'Seq', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'userId', headerName: 'EstateName', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'estateCode', headerName: 'EstateCode', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'approvalCode', headerName: 'ApprovalCode', width: 90, headerAlign: 'center', align: 'center' },
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
          getRowId={(row) => row.email} 
        />
      )}
    </Box>
  );
};

export default ReviewApproval;
