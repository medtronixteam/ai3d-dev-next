import { Stack, Typography } from '@mui/material';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Error404 = () => {
  return /*#__PURE__*/_jsxs(Stack, {
    direction: "column",
    alignItems: "center",
    justifyContent: "center",
    children: [/*#__PURE__*/_jsx(Typography, {
      mt: 3,
      variant: "h1",
      color: "text.disabled",
      children: "404"
    }), /*#__PURE__*/_jsx(Typography, {
      variant: "h6",
      children: "Page not found!"
    })]
  });
};
export default Error404;