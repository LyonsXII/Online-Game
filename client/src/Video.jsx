import React, { useState } from "react";

function Video(props) {

  return (<div>
            <iframe
              src={props.url}
            >
            </iframe>
          </div>)
}

export default Video