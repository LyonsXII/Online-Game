import React, { useState } from "react";
import Button from '@mui/material/Button';

function Choices(props) {
  const correctAnswer = {backgroundColor: "green"};
  const falseAnswer = {backgroundColor: "red"};

  return (
          <div className="choice">
              <Button onClick={props.handleClick} variant="contained" className="option-button" index={props.index} correct={props.correct} style={props.showAnswer ? correctAnswer : null }>
                {props.property}
              </Button>
          </div>
          )
}

export default Choices