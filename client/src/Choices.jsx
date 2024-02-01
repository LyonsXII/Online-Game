import React from "react";
import Button from '@mui/material/Button';


function Choices(props) {
  // Need to pull these from the database
  const options = ["Death Note", "Fullmetal Alchemist", "Gurren Lagann", "Kiznaiver"];

  return (<div class="grid">
            <div onClick={props.hideVideo} class="choice"><Button variant="contained" class="option-button">{options[0]}</Button></div>
            <div class="choice"><Button variant="contained" class="option-button">{options[1]}</Button></div>
            <div class="choice"><Button variant="contained" class="option-button">{options[2]}</Button></div>
            <div class="choice"><Button variant="contained" class="option-button">{options[3]}</Button></div>
          </div>)
}

export default Choices