import React from "react";
import  {useReducer,createContext,Fragment} from "react";
import {BrowserRouter,Routes, Route} from "react-router-dom";
import Login from "./login";
import Card from "./card";
import Signup from "./signup";
import WebcamCapture from "./webcam";
import Home from "./home";
import Coba from"./coba";
import Logout from "./logout";
import { Redirect } from "react-router-dom";

//context
export const AuthContext = createContext()

//initialState
const initialState={
    isAuthenticated : false,
    user:null ,
    token: null
}

//reduser
const reducer =(state,action)=>{
    switch(action.type) {
        case"LOGIN":
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            localStorage.setItem('token', JSON.stringify(action.payload.token))
        return{
            ...state,
            isAuthenticated: true,
            user:action.payload.user,
            token:action.payload.token,
        }
        case "LOGOUT":
            localStorage.clear()
        return{
            ...state,
            isAuthenticated:false,
            user:action.payload.user
        }
        default:
            return state
    }
}

function base() {
    const[state,dispatch] = useReducer(reducer,initialState)
    return (
      <>
      <BrowserRouter>
        <Switch>
            <AuthContext.Provider value={{
                state,
                dispatch
            }}>
            {!state.isAuthenticated ?
                <Redirect
                to={{
                    pathname:"login"
                }} /> :
                <Redirect
                to={{
                    pathname:'card'
                }}  />
            
                }
        

                <Route path="card" element={<Card/>}/>
                <Route path="login" element={<Login/>}/>
                <Route path="logout" element={<Logout/>}/>
                <Route path="signup" element={<Signup/>}/>
                <Route path="facerecog" element={<WebcamCapture/>}/>
                <Route path="coba" element={<Coba/>}/>
                <Route path="/" element={<Login/>}/>

            </AuthContext.Provider>
        </Switch>
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
  
  export default base;
