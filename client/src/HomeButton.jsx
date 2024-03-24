import React from "react";
import Button from '@mui/material/Button';
import { Home } from '@mui/icons-material';

function HomeButton(props) {
  return (<Button onClick={props.resetGame} variant="contained" sx={{boxShadow: 10, border: "2px solid antiquewhite", borderRadius: "4px", minWidth: "0px", width: "40px"}}>
            <Home sx={{height: 20, width: 20}} />
          </Button>)
}

export default HomeButton