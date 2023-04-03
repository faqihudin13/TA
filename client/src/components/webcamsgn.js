import React, {useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";
 
const videoConstraints = {
  width: 540,
  facingMode: "user",
  mirrored : "false"
};
 
const Camera = (props) => {
  const { imageUrl, setImageUrl } = props;
  const [facedetec,setFacedetec]= useState('')
  const boundingBox = "data:image/jpeg;base64,"+facedetec
  
  const webcamRef = useRef(null);

  const capturePhoto = React.useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    let image = imageSrc
    // console.log(image)
    // console.log(imageSrc)
    axios.post('http://127.0.0.1:5000/facedetec', {image:imageSrc})
      .then ( res => {
        setFacedetec(res.data.image)
        // setName(res.data)
})
    .catch(error => {
        console.log(`error = ${error}`)
})
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
          <img src={boundingBox} alt="Screenshot" />
          
        </div>
      )}
    </>
  );
};
 
export default Camera;