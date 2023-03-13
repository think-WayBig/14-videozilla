import * as React from 'react'
import Box from '@mui/material/Box';
import db from '../firebase';
import { collection, getDocs, query, where} from "firebase/firestore";
import { useParams , useLocation,Link } from "react-router-dom";
import CardCover from '@mui/joy/CardCover';
import CircularProgress from "@material-ui/core/CircularProgress";
import HomeIcon from '@mui/icons-material/Home';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';

function VideoDetail() {
    const navigate= useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [video , setVideo] = React.useState([]);
  const [feeds, setFeeds] = React.useState([]);
    const { videoId } = useParams();
    const location = useLocation();

    React.useEffect(() => {
         async function getVideo(){
            
            const q = query(collection(db, `videos`), where("id","==",videoId));
            const snapshot =  await getDocs(q);        
            var data = snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                  };
            });
            setVideo(data);
            setIsLoading(false);
        }
        getVideo();  
    }, [videoId,location]);

    React.useEffect(() => {
        async function fetchFeeds() {
          setIsLoading(true);
          const videoCollection = collection(db, "videos");
          const q = query(videoCollection,where('id', '!=', videoId));
          const querySnapshot = await getDocs(q);
          const fetchedFeeds = querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          setFeeds(fetchedFeeds);
          setIsLoading(false);
        }
        fetchFeeds();
      }, [videoId,location]);
      
      const filteredFeeds = React.useMemo(() => {
        return feeds.filter((feed) => feed.id !== videoId);
      }, [feeds,videoId]);

    const handleCardClick = (videoId) => {
        navigate('../videoDetail/' + videoId);
      };

  return (
    <>
    {isLoading ?(
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
    ):(
        <>
        <Box  sx={{display:'flex',flexWrap:'wrap',flexDirection:'column',gap:'20px',padding:{md:"0px 25px",xs:"0px"}}}>
            {
            video.map((data)=>{
                return <Box key={data.id} sx={{flexGrow:1}} > 
                        <p style={{display:'flex',textTransform:'capitalize'}}><span style={{borderRight:'1px solid #718096',marginRight:'5px',paddingRight:'5px',display:'flex'}}><Link to='/' style={{color:'#fff'}}><HomeIcon/></Link></span>{data.title}</p>
                        {/* <video src={data.videoURL} controls="true" height="400px"></video> */}
                        <CardCover sx={{height:{md:'450px',xs:'300px'},width:'100%',position:'initial'}}>
                            <video
                                controls={true}>
                                <source
                                src={data.videoURL}/>
                            </video>
                        </CardCover>
                    </Box>
            })}
            <Box sx={{flexGrow:1}}></Box>
            <p>Recommended Videos</p>
            <Box sx={{flexGrow:1,display:'flex', flexWrap:'wrap',gap:'15px'}}>
                
                {videoId ? (filteredFeeds.map((feed) => (
                    <Card key={feed.id} onClick={()=>{handleCardClick(feed.id)}} sx={{ maxWidth: 300, boxShadow:'0px 5px 10px -3px rgb(0 0 0 / 15%)', backgroundColor:"#1a202c",borderRadius:'6px'}} >
                        <CardActionArea sx={{overflow:'hidden', "&:hover":{opacity:1}}} >
                            <CardMedia
                            component="video"
                            alt="green iguana"
                            sx={{"&:hover":{transform:'scale3d(1.05, 1.05, 1.05)',overflow:'hidden',opacity:1},background:"#1a202c", transition: "all 0.15s ease-in-out",border:'none',margin:'0px'}}
                            src={feed.videoURL}/>
                        </CardActionArea>
                        <CardContent sx={{ padding:'10px 0 0',boxShadow : 'none' ,borderEndEndRadius:'4px',backgroundColor:'#171923'}}>
                            <p style={{fontSize:'18px',padding:'0 15px',textAlign:'left', fontWeight:500, height:'24px',color:"#fff",overflow:'hidden', margin:'5px 0 0'}} >
                            {feed.title}
                            </p>
                        </CardContent>
                    </Card>
                ))):(<p>No Doc Exists</p>)}
            </Box>
        </Box>
        
      </>
    )
    }
    </>
    )
}

export default VideoDetail