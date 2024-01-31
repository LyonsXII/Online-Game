import React from "react";

function Choices(props) {

  return (<div class="grid">
            <div onClick={props.hideVideo} class="choice">1</div>
            <div class="choice">2</div>
            <div class="choice">3</div>
            <div class="choice">4</div>
          </div>)
}

export default Choices