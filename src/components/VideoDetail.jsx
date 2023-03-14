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
import Avatar from '@mui/material/Avatar';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { IconButton } from '@material-ui/core';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function VideoDetail() {
    const navigate= useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [video , setVideo] = React.useState([]);
    const [feeds, setFeeds] = React.useState([]);
    const [user, setUser] = React.useState([]);
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
            snapshot.docs.map((e)=>{
                var data = e.data();
                var userId= data.userId;
                async function uData(){
                    const userRef = query(collection(db, `users`), where("userId","==",userId));
                    const userDoc = await getDocs(userRef);
                    const userData = userDoc.docs.map((doc)=>{
                        return {
                            id: doc.id,
                            ...doc.data(),
                          };
                    })
                    
                    setUser(userData);
                }
                uData();
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

    //   const threeVideos = filteredFeeds.slice(0, 3);
    const handleCardClick = (videoId) => {
        navigate('../videoDetail/' + videoId);
      };
    function getTimeDifference(timestamp) {
        const now = Date.now();
        const timeDiff = now - timestamp;
        const daysDiff = Math.floor(timeDiff / (24* 60 * 60 * 1000));
        const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
        const minutesDiff = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
        if(hoursDiff<1){ return `${minutesDiff} minutes ago`}
        else if(daysDiff<=1){ return `${minutesDiff} minute ago`}
        else if(daysDiff<1){ return `${hoursDiff} hours ago`}
        else if(daysDiff===1){ return `${daysDiff} day ago`}
        else if(daysDiff>1){ return `${daysDiff} days ago`};
    }
    const PrevArrow = (props) => {
      const { className, onClick } = props;
      return (
        <IconButton className={className} onClick={onClick}>
          <ChevronLeftIcon />
        </IconButton>
      );
    };
    
    const NextArrow = (props) => {
      const { className, onClick } = props;
      return (
        <IconButton className={className} onClick={onClick}>
          <ChevronRightIcon />
        </IconButton>
      );
    };
      const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        arrow : true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                initialSlide: 0,
                infinite: false,
                dots: false,
              },
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 0,
                infinite :false
              },
            },
          ],
     };
  return (
    <>
    {isLoading ?(
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
    ):(
        <Box sx={{display:'block',width:'100%',padding:{md:"0px",xs:"0px"} }}>
        <Box  sx={{display:'flex',flexWrap:'wrap',flexDirection:'row',gap:'20px',flexGrow:1,marginBottom:'20px'}}>
            {
            video.map((data)=>{
                return <Box key={data.id} sx={{flexGrow:1,width:{md:'65%',xs:'100%'}}} > 
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
            <Box sx={{flexGrow:1,display:'flex',flexDirection:'column',width:{md:'30%',xs:'100%'}}}>
            {user.map((user) => {
               return <Box sx={{display:"flex",margin:'10px'}} key={user.id}>
                        <Box>
                            <Avatar sx={{m: 1,bgcolor: '#c8c6c6',color:'#000',marginRight:'10px',width:'50px',height:'50px'}}>
                                <PersonOutlineIcon sx={{ fontSize:'2rem'}}/>
                            </Avatar>
                        </Box>
                        <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center'}}>
                        <p style={{display:'flex',textTransform:'capitalize',marginTop:'0px',marginBottom :'5px'}}>{user.name}</p>
                        {video.map((data)=>{ return <p key={data.id} style={{display:'flex',textTransform:'capitalize',marginTop:'0px',marginBottom :'5px'}}>{getTimeDifference(data.id)}</p>
                        })}
                        </Box>
                      </Box>
            })}
                
            </Box>
        </Box>
        <Box sx={{flexGrow:1,display:'flex',flexDirection:'column', flexWrap:'inherit',overflow:'hidden',gap:'15px'}}>

            <p style={{fontSize:'1.5rem'}}>Recommended Videos</p>
            <Slider {...sliderSettings}>
            
            
                {filteredFeeds.map((feed) => (
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
                ))}

            </Slider>
            </Box>

      </Box>
    )
    }
    </>
    )
}

export default VideoDetail