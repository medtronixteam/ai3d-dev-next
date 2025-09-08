import { Box } from '@mui/material';
import { Icon } from '@iconify/react';
import { jsx as _jsx } from "react/jsx-runtime";
const IconifyIcon = ({
  icon,
  ...rest
}) => {
  return /*#__PURE__*/_jsx(Box, {
    component: Icon,
    icon: icon,
    ...rest
  });
};
export default IconifyIcon;