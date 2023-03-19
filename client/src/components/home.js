import React from "react";
import { Navigate } from 'react-router-dom';

const Home = () =>{
    const isLogin = false;
    if(!isLogin){
        return <Navigate to='/login'/>;
    }

    return(
        <div>HOME</div>
    )
}

export default Home;