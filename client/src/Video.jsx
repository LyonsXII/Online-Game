import React from "react";

function Video(props) {
  return (<div>
            <iframe 
              width="500" 
              height="280" 
              src={props.url}
            >
            </iframe>
          </div>)
}

export default Video