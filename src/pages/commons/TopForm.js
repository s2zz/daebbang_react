import * as React from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const TopForm = () => {
    
  return (
    <div>
      <Button><Link to="/enrollment">중개사무소 가입</Link></Button>
    </div>
  );
};

export default TopForm;
