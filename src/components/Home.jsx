import React from 'react'
import { Routes, Route} from "react-router-dom";
import Navbar from './Navbar';
import Create from './Create';
import Box from '@mui/material/Box';
import Category from './Category';
import Feeds from './Feeds';
import VideoDetail from './VideoDetail';
import UserProfile from './UserProfile';

function Home() {
  return (
    <>
        <Navbar/>
        <Box sx={{padding:'10px' , display:'flex', justifyContent:'center',flexWrap:'wrap'}}>
                <Category/>
            </Box>
        <Box sx={{display:'flex',justifyContent:'center', flexDirection:{xs:'column',md:'row'}}}>
            
            <Box sx={{flexGrow:1,padding:{md:'40px',xs:'20px 40px'},display:'flex'}}>
            <Routes>
                <Route path="/" element={<Feeds />} />
                <Route path="/category/:categoryId" element={<Feeds />} />
                <Route path="/create" element={<Create />} />
                <Route path="/videoDetail/:videoId" element={<VideoDetail />} />
                <Route path="/profile/:uId" element={<UserProfile />} />
            </Routes> 
            </Box>
          </Box>
        

    </>
  )
}

export default Home