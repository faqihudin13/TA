import React, { useState } from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Auth_service from '../service/auth.service'
import './login.css';
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

import { useNavigate } from 'react-router-dom';

function Login() {
  localStorage.clear()
  const initialState={
    isAuthenticated : false,
    username:null ,
    token: null
  }
  // const [username,setUsername] =useState('')
  // const [token,setToken] = useState('')
  const [data, setData] = useState(initialState)
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleLogin = async () => {
    const res = await Auth_service.login(email,pass);
    console.log(res)
    if (res.data.status  === true){
      setData({
        ...data,
        isAuthenticated:true,
        username:res.data.email,
        token:res.access_token
      })
      localStorage.setItem('isAuthenticated', res.data.status)
      localStorage.setItem('Token', res?.data.access_token)
      localStorage.setItem('isLogin', JSON.stringify(res.data.status));
      navigate('/facerecog');
    }
    // else{
    //   navigate('/signup');
    // }
  }
  
  return (
    // <MDBContainer fluid className="p-3 my-5">
    <>
      
    <MDBContainer fluid className='bg-image' >
      <Navbar className='bg-login' variant="dark">
          <MDBContainer>
            <Navbar.Brand href="/login">SPBE</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/signup">Signup</Nav.Link>
            </Nav>
          </MDBContainer>
        </Navbar>

      <MDBRow>

        <MDBCol col='10' md='6' className='logo-spbe' >
        </MDBCol>
          

        <MDBCol col='20' md=''>
            <MDBCard className='my-5 mx-auto bg-glass' style={{borderRadius:'2rem',maxWidth:'500px'}}>
          {/* <MDBCard className='mx-5 mb-5 my-5 p-5 shadow-5' style={{marginTop: '-50px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}> */}
              
              <MDBCardBody className='p-5 w-100 d-flex flex-column text-center'>
                <h2 className="fw-bold mb-5">LOGIN</h2>
                
                <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" onChange={(e)=>{setEmail(e.target.value)}}/>
                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" onChange={(e)=>{setPass(e.target.value)}}/>


                <div className="d-flex justify-content-between mx-4 mb-4">
                  <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                  <a href="!#">Forgot password?</a>
                </div>

                <MDBBtn className="mb-4 w-100" size="lg" onClick={()=>{handleLogin()}}>Login</MDBBtn>
                <div className='d-flex w-full'>
                  <div>Don't have account?</div>
                  <div className='text-primary' style={{cursor:'pointer'}}  onClick={()=>{navigate('/signup')}}>Signup</div>
                </div>
            
              </MDBCardBody>
            </MDBCard>
        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </>
  );
}

export default Login;