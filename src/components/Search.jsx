import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase';
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from '@mui/material/Box';
import CardComponent from './CardComponent';

function Search() {
  const [videos, setVideos] = React.useState([]);
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const searchQuery = new URLSearchParams(location.search).get('title');
  React.useEffect(() => {
    const fetchVideos = async () => {
        setLoading(true);
      const videosRef = collection(db, 'videos');
      const q = query(videosRef, where('title', '>=', searchQuery));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
       // Retrieve user data for each video
    const userIds = results.map((feed) => feed.userId);
    const usersRef = collection(db, "users");
      const usersQuery = query(usersRef, where("userId", "in", userIds)) ;
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
  
      // Map video data to include user's name
      const feedsWithUsers = results.map((feed) => {
        const user = usersData.find((user) => user.userId === feed.userId);
        return {
          ...feed,
          user,
        };
      });
      setVideos(feedsWithUsers);
      setLoading(false);
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <>
    {loading ? (
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
      ) : (
        <Box  sx={{display:'flex',flexWrap:'wrap',gap:'20px',padding:{md:"20px 25px",xs:'20px 0px'}}}>
             {videos.map((video) => (
        <CardComponent key={video.id} id={video.id} videoURL={video.videoURL} title={video.title} userName={video.user.name} views={video.views}/>
      ))}
        </Box>
        )}
    
    </>
  );
}

export default Search;
