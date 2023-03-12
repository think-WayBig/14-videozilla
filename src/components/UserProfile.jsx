import { useLocation, useParams } from "react-router-dom";
import * as React from 'react'
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import db from '../firebase';
import { collection, getDocs, query, where} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from 'react-router-dom';

// const userId=localStorage.getItem('uId');
function UserProfile() {
  const [feeds, setFeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { uId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      const q =  query(collection(db, "videos"), where("userId", "==", uId))
      const querySnapshot = await getDocs(q);
      const fetchedFeeds = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setFeeds(fetchedFeeds);
      setLoading(false);
    }
    fetchFeeds();
  }, [uId, location]);

  const filteredFeeds = React.useMemo(() => {
    return feeds.filter((feed) => feed.userId === uId);
  }, [feeds, uId]);

  const handleCardClick = (videoId) => {
    navigate('../videoDetail/' + videoId);
  };

  return (
    <>
      {loading ? (
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
      ) : (
        <>
        <Box  sx={{display:'flex',flexWrap:'wrap',gap:'20px',padding:{md:"20px 25px",xs:'20px 0px'}}}>
            {uId ? (
              filteredFeeds.map((feed) => (
                <Card key={feed.id} onClick={()=>{handleCardClick(feed.id)}} sx={{ maxWidth: 300, boxShadow:'0px 5px 10px -3px rgb(0 0 0 / 15%)', backgroundColor:"#1a202c",borderRadius:'6px'}} >
                    <CardActionArea sx={{overflow:'hidden', "&:hover":{opacity:1}}} >
                        <CardMedia
                        component="video"
                        alt="green iguana"
                        sx={{"&:hover":{transform:'scale3d(1.05, 1.05, 1.05)',overflow:'hidden',opacity:1},background:"#1a202c", transition: "all 0.15s ease-in-out",border:'none',margin:'0px'}}
                        src={feed.videoURL}
                        
                        />
                    </CardActionArea>
                    <CardContent sx={{ padding:'10px 0 0',boxShadow : 'none' ,borderEndEndRadius:'4px',backgroundColor:'#171923'}}>
                        <p style={{fontSize:'18px',padding:'0 15px',textAlign:'left', fontWeight:500, height:'24px',color:"#fff",overflow:'hidden', margin:'5px 0 0'}} >
                        {feed.title}
                        </p>
                    </CardContent>
                </Card>
              ))
            ) : (
              <p>No Doc Exists</p>
            )}
          </Box>
        </>
      )}
    </>
  );
}

export default UserProfile;