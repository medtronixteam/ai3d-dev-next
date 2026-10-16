'use client';

import { useLocation } from 'react-router-dom';
import Stack from '@mui/material/Stack';

const AuthLayout = ({ children }) => {
  return (
    <Stack
      bgcolor="info.lighter"
     
    >
      {children}
    </Stack>
  );
};

export default AuthLayout;