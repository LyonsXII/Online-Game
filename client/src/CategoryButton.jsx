import React from "react";
import { Grid } from "@mui/material";
import Button from '@mui/material/Button';

function CategoryButton(props) {
  return (<Grid item xs={6}><Button onClick={props.chooseCategory} onMouseOver={props.updateExplain} 
    onMouseLeave={props.hideExplain} value={props.buttonText} variant="contained" sx={{ width: 1, boxShadow: 10, border: "2px solid antiquewhite", height: "100%", padding: 0, typography: "h4", fontFamily: "Anta" }}>
      {props.buttonText}
  </Button></Grid>)
}

export default CategoryButton