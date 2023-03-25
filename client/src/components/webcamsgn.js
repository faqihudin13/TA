import React, {useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
 
const videoConstraints = {
  width: 540,
  facingMode: "environment"
};
 
const Camera = (props) => {
  const { imageUrl, setImageUrl } = props;
  
  
  const webcamRef = useRef(null);

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
//     let image = imageSrc
//     // console.log(image)
//     // console.log(imageSrc)
//     axios.post('http://127.0.0.1:5000/facerecog', {image:imageSrc})
//       .then(res => {
//         console.log(res.data)
//         // setName(res.data)
// })
//     .catch(error => {
//         console.log(`error = ${error}`)
// })
    setImageUrl(imageSrc);
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
      <button onClick={() => setImageUrl(null)}>Refresh</button>
      {imageUrl && (
        <div>
          <img src={imageUrl} alt="Screenshot" />
          
        </div>
      )}
    </>
  );
};
 
export default Camera;