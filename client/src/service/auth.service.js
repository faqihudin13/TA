import React from "react";
import axios from 'axios';


const login = (email, password) => {
    return(
        axios.post('http://127.0.0.1:5000/login',{email, password})
            .then(res=>{
                return res.data;
            })
        
    )
};

const signup = (email, password1,password2, imageUrl) => {
    return(
        axios.post('http://127.0.0.1:5000/sign-up',{email,password1,password2, imageUrl})
            .then(res=>{
                return res.data;
            })
        
    )
};



const Auth_service = {login,signup}


export default Auth_service ;