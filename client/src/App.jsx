import React, { useEffect, useState } from 'react';
import Title from './Title';
import Video from "./Video";
import Choices from "./Choices"
function App() {

  return (
    <div>
      <Video url="https://www.youtube.com/embed/kNyR46eHDxE?autoplay=1&mute=1" />
      <Choices />
    </div>
  )
}

export default App
