import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import db from '../firebase';
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from '@mui/material/Box';
import CardComponent from './CardComponent';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';


const theme = createTheme({
  components:{
      MuiSnackbar: {
        styleOverrides:{
          root: {
            bottom:'0px' ,
            minWidth :'250px'
          },
        }
      },
  }
});

function Search() {
  const [videos, setVideos] = React.useState([]);
  const location = useLocation();
  const navigate = useNavigate(); 
  const [loading, setLoading] = React.useState(true);
  const searchQuery = new URLSearchParams(location.search).get('title');
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
  });
  
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  React.useEffect(() => {
    const fetchVideos = async () => {
        setLoading(true);
      const videosRef = collection(db, 'videos');
      const q = query(videosRef, where('title', '>=', searchQuery.toLowerCase()));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        const video = { id: doc.id, ...doc.data() };
      if (video.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push(video);
      }
      });
       // Retrieve user data for each video
    const userIds = results.map((feed) => feed.userId);
    if(userIds.length>0){
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
    }
    else{
      
      // alert('No videos found');
      setVideos([]);
      setSnackbar({
        open: true,
        message: 'No videos found. Please try a different search query.',
      });
      setTimeout(()=>{navigate('/')},2000)
    }

    setLoading(false);
    
    };
    fetchVideos();
  }, [searchQuery]);

  return (
    <>
    {loading ? (
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
      ) : (
        <Box sx={{flexGrow:1}}>
        <Box  sx={{display:'flex',flexWrap:'wrap',gap:'20px',padding:{md:"20px 20px",xs:'20px 0px'}, justifyContent:{md:'left',xs:'center'}}}>
             {videos.map((video) => (
        <CardComponent key={video.id} id={video.id} videoURL={video.videoURL} thumbnailURL={video.thumbnailURL} title={video.title} userName={video.user.name} views={video.views}/>
      ))}
        </Box>
        </Box>
        )}
    <Box sx={{display:'flex',justifyContent:'center',width:'100%',position:'fixed',bottom:'24px',zIndex:'1'}}>
      <ThemeProvider theme={theme}>
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ display: "block", position: "sticky" }}
      />
      </ThemeProvider>
    </Box>
    </>
  );
}

export default Search;
