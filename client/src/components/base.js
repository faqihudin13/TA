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
          <Route path="/" element={<Login/>}>
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
