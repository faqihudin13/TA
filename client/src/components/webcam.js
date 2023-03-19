import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './webcam.css';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  
  const videoConstraints = {
    width : 200,
    height : 200,
    facingMode: 'user'
  };
  const[name, setName] = useState('')
  const capture = React.useCallback(
  () => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(`imageSrc = ${imageSrc}`)
                //for deployment, you should put your backend url / api
    axios.post('https://mynicholas.my.id/api', {data : imageSrc})
    	  .then(res => {
      	  console.log(`response = ${res.data}`)
      	  setName(res.data)
    })
    	  .catch(error => {
      	  console.log(`error = ${error}`)
    })
  }, 
   [webcamRef]
  );
  const navigate = useNavigate();
  if ({name}  === 'faqih'){
    navigate('/card');
  }
  else{
    navigate('/login');
  }
  return (
    <div className='webcam-container'>
      <div className='facerecog'>
        <h3>FACERECOGNITION</h3>
      </div>
      <div className='webcam'>
        <Webcam
        audio = {false}
      height = {500}
      ref = {webcamRef}
      screenshotFormat = "image/jpeg"
      width = {500}
      videoConstraints = {videoConstraints}
      />
      </div>
      <div className='button-container'>
        <button onClick={capture} className='button'>Click Me!</button>
      </div>
      <div className='name-container'>
          <h3 className='name' >{name}</h3>
      </div>
      
      
  </div>
	);
  
};

export default WebcamCapture;
