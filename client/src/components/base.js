import React from "react";
import { useState } from "react";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Login from "./login";
import Card from "./card";
import Signup from "./signup";
import WebcamCapture from "./webcam";
import Home from "./home";
import Coba from"./coba";
import Logout from "./logout";



function Navbar_main() {
    return (
      <>
      <BrowserRouter>
        <Routes>
          
          <Route path="card" element={<Card/>}>
          </Route>
          <Route path="login" element={<Login/>}>
          </Route>
          <Route path="logout" element={<Logout/>}>
          </Route>
          <Route path="signup" element={<Signup/>}>
          </Route>
          <Route path="facerecog" element={<WebcamCapture/>}>
          </Route>
          <Route path="coba" element={<Coba/>}>
          </Route>
          <Route path="/" element={<Home/>}>
          </Route>
  
        </Routes>
      </BrowserRouter>
        <div>
        

        {/* <Routes>
            <Route exact path='/login' element={<Login/>}/>

        </Routes> */}
        </div>
        
        
      </>
    );
  }
  
  export default Navbar_main;



  //const Base = () => {
    
    //     return(
    //         <>
    //         <Navbar bg="dark" variant="dark">
    //             <Container>
    //                 <Nav className="me-auto">
    //                     <Nav.Link href="#Login" className="nav-item nav-link">
    //                         Login
    //                     </Nav.Link>
    //                     <Nav.Link href="#Logout">
    //                         Logout
    //                     </Nav.Link>
    //                     <Nav.Link href="#Signup">
    //                         Signup
    //                     </Nav.Link>
    //                     <Nav.Link href="#Home">
    //                         Home
    //                     </Nav.Link>
    //                 </Nav>
    //             </Container>
    //         </Navbar>
    //         </>
    //     //     <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    //     //   <button
    //     //     class="navbar-toggler"
    //     //     type="button"
    //     //     data-toggle="collapse"
    //     //     data-target="#navbar"
    //     //   >
    //     //     <span class="navbar-toggler-icon"></span>
    //     //   </button>
    //     //   <div class="collapse navbar-collapse" id="navbar">
    //     //     <div class="navbar-nav">
    //     //       {% if user.is_authenticated %}
    //     //       <a class="nav-item nav-link" id="home" href="/">Home</a>
    //     //       <a class="nav-item nav-link" id="logout" href="/logout">Logout</a>
    //     //       {% else %}
    //     //       <a class="nav-item nav-link" id="login" href="/login">Login</a>
    //     //       <a class="nav-item nav-link" id="signUp" href="/sign-up">Sign Up</a>
    //     //       {% endif %}
    //     //     </div>
    //     //   </div>
    //     // </nav>
    //     )
    // }
    
    // // export default Base;