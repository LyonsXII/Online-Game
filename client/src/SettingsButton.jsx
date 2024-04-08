import React from "react";
import Button from '@mui/material/Button';
import { Settings } from '@mui/icons-material';

function SettingsButton(props) {
  return (<Button onClick={props.toggleSettingsMenu} variant="contained" sx={{boxShadow: 10, border: "2px solid antiquewhite", borderRadius: "4px", minWidth: "0px", height: "70px", width: "70px"}}>
            <Settings sx={{height: 50, width: 50}} />
          </Button>)
}

export default SettingsButton