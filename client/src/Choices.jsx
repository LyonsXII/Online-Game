import React, { useState } from "react";
import Button from '@mui/material/Button';

function Choices(props) {
  const options = ["Death Note", "Fullmetal Alchemist", "Gurren Lagann", "Kiznaiver"];

  const [correct, setCorrect] = useState("red");

  return (<div class="grid">
            <div onClick={props.hideVideo} class="choice">
              <Button variant="contained" class="option-button">{options[0]}</Button></div>
            <div class="choice">
              <Button style={{ backgroundColor: correct }} variant="contained" class="option-button">{options[1]}</Button>
            </div>
            <div class="choice"><Button variant="contained" class="option-button">{options[2]}</Button></div>
            <div class="choice"><Button variant="contained" class="option-button">{options[3]}</Button></div>
          </div>)
}

export default Choices