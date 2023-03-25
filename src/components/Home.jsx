import React from 'react'
import { Routes, Route, Navigate, useLocation,useParams} from "react-router-dom";
import Navbar from './Navbar';
import Create from './Create';
import Box from '@mui/material/Box';
import Feeds from './Feeds';
import VideoDetail from './VideoDetail';
import UserProfile from './UserProfile';
import Search from './Search';
import UserDetails from './UserDetails';


function Home() {
var userId = localStorage.getItem('uId');

  return (
    <>
    
        <Navbar/>
        
        <Box sx={{display:'flex',justifyContent:'center', flexDirection:{xs:'column',md:'row'}}}>
            
            <Box sx={{flexGrow:1,padding:{md:'40px',xs:'20px 0px'},display:'flex'}}>
            <Routes>
                <Route path="/" element={<Feeds />} />
                <Route path="/category/:categoryId" element={<Feeds />} />
                <Route path="/search" element={<Search />} />
                <Route path="/:user" element={<UserDetails />} />
                <Route path="/create" element={userId !== null ? <Create />:<Navigate replace to={"/login"} />} />
                <Route path="/videoDetail/:videoId" element={<VideoDetail />}/>
                <Route path="/profile/:uId" element={userId !== null ? <UserProfile />:<Navigate replace to={"/login"} />} />
            </Routes> 
            </Box>
          </Box>
    
    
        
  
  </>
  )
}

export default Home