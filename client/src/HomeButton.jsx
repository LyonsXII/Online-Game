import React from "react";
import Button from '@mui/material/Button';
import { Home } from '@mui/icons-material';

function HomeButton(props) {
  return (<Button onClick={props.resetGame} variant="contained" sx={{boxShadow: 10, border: "2px solid antiquewhite", borderRadius: "4px", minWidth: "0px", height: "70px", width: "70px"}}>
            <Home sx={{height: 50, width: 50}} />
          </Button>)
}

export default HomeButton