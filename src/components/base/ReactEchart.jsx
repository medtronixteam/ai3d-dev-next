import { forwardRef } from 'react';
import { Box } from '@mui/material';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import { jsx as _jsx } from "react/jsx-runtime";
const ReactEchart = /*#__PURE__*/forwardRef(({
  option,
  ...rest
}, ref) => {
  return /*#__PURE__*/_jsx(Box, {
    component: ReactEChartsCore,
    ref: ref,
    option: {
      ...option,
      tooltip: {
        ...option.tooltip,
        confine: true
      }
    },
    ...rest
  });
});
export default ReactEchart;