import React from "react";
import { Navigate } from 'react-router-dom';

const Logout = () =>{
    return(
        <Navigate to='/login'/>
    )
};

export default Logout;