import React, {Fragment, useContext} from "react";
import axios from 'axios'
import {AuthContext} from './base_test'
import {
    MDBContainer,
    MDBCol,
    MDBRow,
    MDBBtn,
    MDBInput,
    MDBCheckbox,
    MDBCard,
    MDBCardBody
  }
  from 'mdb-react-ui-kit';
import { FormGroup } from "react-bootstrap";



const qs = require('querystring')
const api = 'http://localhost:3000'

function loginComp() {
    const {dispatch} = useContext(AuthContext)
    const initialState = {
        email: "",
        password:"",
        isSubmitting: false,
        errorMessage: null
    }
    const [data,setData]= useState(initialState)

    const handleInputChange = e =>{
        setData({
            ...data,
            [e.target.name] : e.target.value
        })
    }
    const handleFormSubmit = e =>{
        e.preventDefault()
        setData({
            ...data,
            isSubmitting: true,
            errorMessage: null
        })
        const requestBody={
            email:data.email,
            password : data.password
        }
        const config = {
            headers:{
                'Content-Type':'application/x-www--form-urlencoded'
            }
        }
        //post ke back-end
        axios.post(api+'/login',qs.stringify(requestBody),config)
        .then(res=>{
            if (res.data.success==true){
                dispatch({
                    type:"LOGIN",
                    payload: res.data
                })
            }
            else {
                setData({
                    ...data,
                    isSubmitting:false,
                    errorMessage:res.data.Message
                })
            }

            throw res
            
        })
    }
    return(
        <Fragment>
            <MDBContainer fluid className='bg-image' >
                <Navbar className='bg-login' variant="dark">
                    <MDBContainer>
                        <Navbar.Brand href="/home">SPBE</Navbar.Brand>
                        <Nav className="me-auto">
                        <Nav.Link href="/login">Login</Nav.Link>
                        <Nav.Link href="/signup">Signup</Nav.Link>
                        </Nav>
                    </MDBContainer>
                    </Navbar>

                <MDBRow>

                    <MDBCol col='10' md='6' className='logo-spbe' >
                    </MDBCol>
                    

                    <MDBCol col='6' md=''>
                        <MDBCard className='my-5 mx-auto bg-glass' style={{borderRadius:'2rem',maxWidth:'500px'}}>
                    {/* <MDBCard className='mx-5 mb-5 my-5 p-5 shadow-5' style={{marginTop: '-50px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}> */}
                        
                        <MDBCardBody className='p-5 w-100 d-flex flex-column text-center'>
                            <Form onSubmit={handleFormSubmit}>
                                {/* Judul */}
                                <h2 className="fw-bold mb-5">LOGIN</h2>
                                {/* input form */}
                                <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" value={data.email} onChange={handleInputChange}/>
                                <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" valeu={data.password} onChange={handleInputChange}/>


                                <div className="d-flex justify-content-between mx-4 mb-4">
                                <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                                <a href="!#">Forgot password?</a>
                                </div>

                                <MDBBtn className="mb-4 w-100" size="lg" onClick={()=>{handleLogin()}}>Login</MDBBtn>
                                <div className='d-flex w-full'>
                                <div>Don't have account?</div>
                                <div className='text-primary' style={{cursor:'pointer'}}  onClick={()=>{navigate('/signup')}}>Signup</div>
                                </div>
                            </Form>
                            
                        
                        </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                </MDBRow>

            </MDBContainer>
        </Fragment>
    )
}