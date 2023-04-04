import React, {useState} from 'react';
import axios from 'axios';
import Webcam from 'react-webcam';
import './webcam.css';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MDBCardImage } from 'mdb-react-ui-kit';
import { decodeToken } from "react-jwt";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBValidation,
  MDBValidationItem,
  MDBInput,
  MDBCheckbox,
  MDBCard,
  MDBCardBody
}
from 'mdb-react-ui-kit';

const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const token= decodeToken(localStorage.getItem('Token'))
  const[image, setImage] = useState('')
  const [counter,setCounter]= useState(0)
  const [accuracy,setAcuracy] = useState('')
  const [result,setResult] = useState('')
  const dataImage ="data:image/jpeg;base64,"+ image
  const videoConstraints = {
    width : 200,
    height : 200,
    facingMode: 'user',
    mirrored:'true'
  };

  const capture = React.useCallback(
  () => {
    const email= token.sub.email 
    const imageSrc = webcamRef.current.getScreenshot();
                //for deployment, you should put your backend url / api
    axios.post('http://127.0.0.1:5000/facerecog', {imageSrc,email})
    	  .then(res => {
          setResult(res.data.result)
          setAcuracy(res.data.facenet)
          setImage(res.data.image)
          console.log(res.data)
          return res.data;
    })
  }, 
   [webcamRef]
  );
  const handleCounter =()=>{
    setCounter(counter+1)

  }
  const isLogin = localStorage.getItem('isLogin') || false;
  const card = localStorage.getItem('card')||false
  const Authenticated = localStorage.getItem('Authenticated');
    // console.log(isLogin)
  if(isLogin === false) {
    return <Navigate to='/login'/>
  }  
  if(card===true){
    return <Navigate to='/card'/>
  }
  
  if (counter>5){
    const nicetry='Nice Try';
    console.log(nicetry)
    return <Navigate to='/login'/>
  }
  if(accuracy>80){
    // const date = Date()
    // const expDate= date + 3
    localStorage.setItem('Authenticated',true)
    // if(Date.now()===expDate){
    return <Navigate to='/card'/>
    // }  
  }


  return (
    <MDBContainer fluid className='webcam-container' >
      <div className='facerecog'>
        <h3>Face Recogniton</h3>
      </div>
      <MDBRow className='row-container d-flex justify-content-center mb-3'>
        <MDBCol className='col-container'>
          <div className='camera'>
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
            <button onClick={()=>{capture();handleCounter();}} className='button'>Click Me!</button>
            <h3 className='counter' >{counter}</h3>
          </div>
          {/* <div className='name-container'>
            <h3 className='name' >{counter}</h3>
          </div> */}
        </MDBCol>
        <MDBCol className=''>
          <div className='dataImage'>
            <img src={dataImage}/>
          </div>
          <div className='accuracy-container'>
            <div className='accuracy'>
              <p>{accuracy}</p>
            </div>
            
          </div>
          
            
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    
  //   <div className='webcam-container'>
      // <div className='facerecog'>
      //   <h3>FACERECOGNITION</h3>
      // </div>
  //     <div className='row'>
  //       <div className='column'>
  //           <div className='webcam'>
            //   <Webcam
            // audio = {false}
            // height = {500}
            // ref = {webcamRef}
            // screenshotFormat = "image/jpeg"
            // width = {500}
            // videoConstraints = {videoConstraints}
            // />
            // </div>
            // <div className='button-container'>
            //   <button onClick={capture} className='button'>Click Me!</button>
              
            // </div>
            // <div className='name-container'>
            //     <h3 className='name' >{name}</h3>
            // </div>
  //       </div>
  //       <div className='column'>
  //         <img src={dataImage}/>
  //       </div>
        
  //     </div>
      
      
      
  // </div>
	);
  
};

export default WebcamCapture;