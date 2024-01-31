import React, { useState } from "react";

function Video(props) {
  const hiddenVideo = { width: 0, height: 0, position: "absolute", border: 0 }

  return (<div class="grid-container">
            <iframe
              style={props.hidden ? hiddenVideo : null}
              width="500" 
              height="280" 
              src={props.url}
            >
            </iframe>
          </div>)
}

export default Video