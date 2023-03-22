import React, {useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
 
const videoConstraints = {
  width: 540,
  facingMode: "environment"
};
 
const Camera = () => {
  const webcamRef = useRef(null);
  const [url, setUrl] = React.useState(null);


  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    let image = imageSrc
    console.log(image)
    // console.log(imageSrc)
    axios.post('http://127.0.0.1:5000/facerecog', {image:imageSrc})
      .then(res => {
        console.log(res.data)
        // setName(res.data)
})
    .catch(error => {
        console.log(`error = ${error}`)
})
    setUrl(imageSrc);
  }, [webcamRef]);
 
  const onUserMedia = (e) => {
    console.log(e);
  };
 
  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
      />
      <button onClick={capturePhoto}>Capture</button>
      <button onClick={() => setUrl(null)}>Refresh</button>
      {url && (
        <div>
          <img src={url} alt="Screenshot" />
        </div>
      )}
    </>
  );
};
 
export default Camera;