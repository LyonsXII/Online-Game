import React from "react";
import Button from '@mui/material/Button';
import { ElectricBolt } from '@mui/icons-material';

function ToggleTheme(props) {
  return (<Button onClick={props.toggleTheme} variant="contained" sx={{boxShadow: 10, border: "2px solid antiquewhite", borderRadius: "4px", minWidth: "0px", width: "40px"}}>
            <ElectricBolt sx={{height: 20, width: 20}} />
          </Button>)
}

export default ToggleTheme