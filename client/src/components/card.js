import React ,{useState} from 'react'
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import  Container  from "react-bootstrap/Container";
import { Navigate,useNavigate } from 'react-router-dom';
import'./card.css'
import { isExpired, decodeToken } from "react-jwt";

const Card = () => {
    // const isLogin = false;
    //   if(!isLogin){
    //       return <Navigate to='/login'/>;
    //   }
    const navigate=useNavigate()
    const [auth,setAuth] = useState('false')
    const[name, setName] = useState('Anya')
    const[job, setJob] = useState('Esper')
    const[about, setAbout] = useState('Anya Forger is a character from the anime Spy x Family[1]. She has shoulder-length, light pink hair that curls inwards with a fringe that reaches just above her eyes and a small strand of ahoge at the top of her head.')
    //TOKEN
    // const token = localStorage.getItem('Token')
    
    // const { decodedToken, isExpired, reEvaluateToken } = useJwt(token);
    // const updateToken = () => {
    //   const newToken = "A new JWT";
    //   reEvaluateToken(newToken); // decodedToken and isExpired will be updated
    // }
    const date = Date.now()
    // console.log(expired)
  
    
    
    const isLogin = localStorage.getItem('isLogin') || false;
    const Authenticated = localStorage.getItem('Authenticated') || false;
    // console.log(isLogin)
    if(isLogin === false) {
      return <Navigate to='/login'/>
    }
    if (Authenticated=== false ){
      return <Navigate to='/facerecog'/>
    }
    const token= decodeToken(localStorage.getItem('Token'))
    const username = token.sub.username
    const image = token.sub.image
    console.log(username)
    if (token.exp * 1000 < date){
      return <Navigate to='/login'/>
    }
    localStorage.setItem('card',true)
    return(
        <>
        <div className='bg-container'>
          <Navbar className='bg-navbar' variant="dark">
            <Container>
              <Navbar.Brand href="/login">SPBE</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link href="/logout">Logout</Nav.Link>
              </Nav>
            </Container>
          </Navbar>
          <div className='jumbotron'>
            <div className='image'>
              <img src={image}></img>
            </div>
            <div className='text'>
              <h1 className="display-3">Hello, {username}!</h1>
              <p > Hope you have a pleasant day.</p>
            </div>
            
            
          </div>
          {/* <div className='card-container'>
            <div className='card1'>
                  <div className='upper-container'>
                      <div className='image-container'>
                          <img src='https://i.pinimg.com/736x/7d/23/f1/7d23f18d48f8509e53bb4e52f99214ce.jpg' alt='' height='100px' width='100px'></img>
                      </div>
                  </div>
                  <div className='lower-container'>
                      <h3>{name}</h3>
                      <h4>{job}</h4>
                      <p>{about}</p>
                  </div>
            </div>
          </div> */}
          
        </div>
        
        </>
        
    )
}

export default Card;