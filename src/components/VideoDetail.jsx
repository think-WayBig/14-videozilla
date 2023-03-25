import * as React from 'react'
import Box from '@mui/material/Box';
import db from '../firebase';
import { storage } from '../firebase';
import { arrayUnion, collection, deleteDoc, getDocs, increment, query, updateDoc, where} from "firebase/firestore";
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
import Button from '@mui/material/Button';
import { deleteObject, ref } from 'firebase/storage';
import ReactPlayer from "react-player";
import CardComponent from './CardComponent';


function VideoDetail() {

    const navigate= useNavigate();
    const [isLoading, setIsLoading] = React.useState(true);
    const [video , setVideo] = React.useState([]);
    const [feeds, setFeeds] = React.useState([]);
    const [user, setUser] = React.useState([]);
    const [user3, setUser3] = React.useState([]);
    const [userVideos, setUserVideos] = React.useState([]);
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
                    });
                    setUser(userData);
                }
                uData();
                return data;
            });
            snapshot.docs.map((e)=>{
              // var id = e.data().id;
              async function views(){
                const response = await fetch('https://api.ipify.org?format=json')
                const data = await response.json();
                let ipAddress = data.ip;
                // console.log(ipAddress);
                // console.log(id)
                 
                  const viewedBy = e.data().viewedBy || [];
                  if(!viewedBy.includes(ipAddress)){
                    await updateDoc(e.ref,{
                      views:increment(1),
                      viewedBy : arrayUnion(ipAddress)
                    })   
                  }
                         
              }
              views();
            })
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
          const userId = fetchedFeeds.map((e)=> e.userId);
            
                const userRef = query(collection(db, `users`), where("userId","in",userId));
                const userDoc = await getDocs(userRef);
                const userData = userDoc.docs.map((doc)=>doc.data());
                const feedsWithUsers = fetchedFeeds.map((feed) => {
                  const user = userData.find((user) => user.userId === feed.userId);
                  return {
                    ...feed,
                    user,
                  };
                });
          setFeeds(feedsWithUsers);
          setIsLoading(false);
        }
        fetchFeeds();
      }, [videoId,location]);
      


      React.useEffect(() => {
        async function fetchUserVideos() {
          setIsLoading(true);
          const videoCollection = collection(db, "videos");
          const q = query(videoCollection,where('id','==',videoId));
          const querySnapshot = await getDocs(q); 
          querySnapshot.docs.map((doc) => {
            return {
              id: doc.id,
              ...doc.data(),
            };
          });
          querySnapshot.docs.map((e)=>{
            var data = e.data();
            var userId= data.userId;
            async function uData(){
                const userRef = query(collection(db, `videos`), where("userId","==",userId));
                const userDoc = await getDocs(userRef);
                const userData = userDoc.docs.map((doc)=>{
                    return {
                        id: doc.id,
                        ...doc.data(),
                      };
                })
                setUserVideos(userData);
                setIsLoading(false);
                
                userDoc.docs.map((e)=>{
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
                      setUser3(userData);
                  }
                  uData();
              });
            }
            uData();
        });
        }
        fetchUserVideos();

      }, [videoId,location]);
    
      const filteredFeeds2 = React.useMemo(() => {
        return userVideos.filter((feed) => feed.id !== videoId );
      }, [userVideos,videoId]);
      const threeVideos = filteredFeeds2.slice(0, 3);
    const handleCardClick = (videoId) => {
        navigate('../videoDetail/' + videoId);
      };
      function getTimeDifference(timestamp) {
        const now = Date.now();
        const timeDiff = now - timestamp;
        const daysDiff = Math.floor(timeDiff / (24* 60 * 60 * 1000));
        const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
        const minutesDiff = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
        const weeksDiff = Math.floor(daysDiff / 7);
        const monthsDiff = Math.floor(daysDiff / 30);
        const yearsDiff = Math.floor(daysDiff / 365);
        
        if (yearsDiff > 0) {
          return `${yearsDiff} year${yearsDiff > 1 ? "s" : ""} ago`;
        } else if (monthsDiff > 0) {
          return `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`;
        } else if (weeksDiff > 0) {
          return `${weeksDiff} week${weeksDiff > 1 ? "s" : ""} ago`;
        } else if (daysDiff > 0) {
          return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
        } else if (hoursDiff > 0) {
          return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
        } else if (minutesDiff > 0) {
          return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
        } else {
          return "Just now";
        }
    
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
                slidesToShow: 2,
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
                initialSlide: 0,
                infinite :false
              },
            },
          ],
     };
    async function deletebtn(){
      const uId = localStorage.getItem('uId');
      const videoCollection = collection(db, "videos");
      const q = query(videoCollection,where('id', '==', videoId));
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map((doc)=>{
        var data = doc.data();
        var userId = data.userId;
        if(userId == uId){
          localStorage.setItem('response',"true");
        }
        else{
          localStorage.setItem('response',"false");
        }
      })
    }
    deletebtn();
     const handleDelete = async () =>{
        try{
          const videoCollection = collection(db, "videos");
          const q = query(videoCollection,where('id', '==', videoId));
          const querySnapshot = await getDocs(q);
          if(querySnapshot.size === 0){
            alert(`Video URL not found: ${videoId}`)
          }
            querySnapshot.docs.map(async (doc)=>{
              var data = doc.data();
              var videoName =  data.videoName;
              // console.log(videoName);
              const videoRef = ref(storage, `videos/${videoName}`);
            await deleteObject(videoRef);
            await deleteDoc(doc.ref);
            
              alert("Video Deleted Successfully");
              navigate('/');
              
            });
            
        }
        catch(e){
          console.error(e);
        };
     }

     const playerConfig = {
      file: {
        attributes: {
          controlsList: "nodownload",
        },
      },
      youtube: {
        playerVars: {
          controls: 1,
          modestbranding: 1,
          quality: 'hd1080',
        },
      },
    }
    const response = localStorage.getItem('response');
  return (
    <>
    {isLoading ?(
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
    ):(
        <Box sx={{display:'block',width:'100%',padding:{md:"0px",xs:"0px 0px"}}}>
        <Box  sx={{display:'flex',flexWrap:'wrap',flexDirection:'row',gap:'20px',flexGrow:1,marginBottom:'20px',padding:{md:'0px',xs:'0px 20px'}}}>
            {
            video.map((data)=>{
                return <Box key={data.id} sx={{flexGrow:1,width:{md:'65%',xs:'100%'}}} > 
                        <p style={{display:'flex',textTransform:'capitalize'}}><span style={{borderRight:'1px solid #718096',marginRight:'5px',paddingRight:'5px',display:'flex'}}><Link to='/' style={{color:'#fff'}}><HomeIcon/></Link></span>{data.title}</p>
                        {/* <video src={data.videoURL} controls="true" height="400px"></video> */}
                        <CardCover sx={{width:'100%',position:'relative',height:{lg:'550px',md:'390px',sm:'420px',xs:'250px'}, flexGrow:1}}>
                            {/* <video
                                controls={true}>
                                <source
                                src={data.videoURL}/>
                            </video> */}
                            <ReactPlayer controls={true} className="reactPlayer" height="100%" width='100%' url={data.videoURL} style={{display:'block',height:'100%',width:'100%', position:'absolute',top:'0px',bottom:'0px'}} config={playerConfig}/>
                            
                        </CardCover>
                    </Box>
            })}
            <Box sx={{flexGrow:1,display:'flex',flexDirection:'column',width:{md:'30%',xs:'100%'}}}>
            {user.map((user) => {
               return <Box sx={{display:"flex",padding:'10px'}} key={user.id}>
                        <Box>
                            <Avatar sx={{m: 1,bgcolor: '#c8c6c6',color:'#000',marginRight:'10px',width:'50px',height:'50px'}}>
                                <PersonOutlineIcon sx={{ fontSize:'2rem'}}/>
                            </Avatar>
                        </Box>
                          <Box sx={{display:'flex', flexDirection:'column',justifyContent:'center',flexGrow:1}}>
                          <p style={{display:'flex',textTransform:'capitalize',marginTop:'0px',marginBottom :'5px', cursor:'pointer'}} onClick={()=>navigate(`/@${user.name}`)}>{user.name}</p>
                          {video.map((data)=>{ return <p key={data.id} style={{display:'flex',textTransform:'capitalize',marginTop:'0px',marginBottom :'5px'}}>{getTimeDifference(data.id)}</p>
                          })}
                          </Box>
                        <Box>
                        {response === "true" ? <Box padding="10px 30px" display="block" id="deletebtn">
                        <Button sx={{backgroundColor:'#fff !important', color:'#333 !important', cursor:'pointer', fontWeight:'600',padding:'10px 20px !important',fontSize:'16px',border:'1px solid #fff !important', borderRadius:'6px !important', '&:hover':{backgroundColor:'transparent !important',color:'#fff !important',fontWeight:'500 !important'}}}onClick={handleDelete} title="Delete">Delete</Button>
                        </Box> :""}
                        </Box>
                      </Box>
            })} 
                
                <Box sx={{display:'grid',gridTemplateColumns:'1fr',padding:'10px'}}>
                <p>More from the user</p>
                  {threeVideos.map((feed)=>{
                    return <Card key={feed.id} onClick={()=>{handleCardClick(feed.id)}} sx={{ boxShadow:'none', backgroundColor:"#1a202c",display:'grid',gridTemplateColumns:'1fr',marginBottom:'10px'}} >
                    <CardActionArea sx={{overflow:'hidden', "&:hover":{opacity:1},gridColumn:'-3'}} style={{borderRadius:'10px'}}>
                        <CardMedia
                        component="video"
                        alt="green iguana"
                        sx={{"&:hover":{transform:'scale3d(1.05, 1.05, 1.05)',overflow:'hidden',opacity:1},background:"linear-gradient(177deg, #1c202e, black)", transition: "all 0.15s ease-in-out",border:'none',margin:'0px',width:'100px',objectFit:'cover',height:'95px'}}
                        src={feed.videoURL}/>
                    </CardActionArea>
                    <CardContent  sx={{boxShadow : 'none',backgroundColor:'transparent',gridColumn:1}} style={{padding:'0px 0px 0px 0px'}}>
                      
                      <Box >
                      <p style={{fontSize:'15px',padding:'0 15px',textAlign:'left', fontWeight:400, maxHeight:'45px',color:"#fff",overflow:'hidden', margin:'5px 0'}} >
                        {feed.title}
                        </p>
                        {user3.map((user2)=>{
                         return <p style={{textTransform:'capitalize',marginTop:'0px',marginBottom :'5px',fontSize:'13px',padding:'0 15px',color:'#bfbfbf'}} key={user2.id}>{user2.name}</p>
                        })}
                       <p style={{textTransform:'lowercase',marginTop:'0px',marginBottom :'5px',fontSize:'13px',padding:'0 15px',color:'#bfbfbf'}}><span style={{marginRight:'5px'}}>{feed.views}</span>views<span style={{margin:'auto 5px',fontWeight:'900'}}>.</span>{getTimeDifference(feed.id)}</p>
                      </Box>
                        
                    </CardContent>
                </Card>
                  })}
                </Box>

            </Box>
        </Box>
        <Box sx={{flexGrow:1,display:'flex',flexDirection:'column', flexWrap:'inherit',overflow:'hidden',gap:'15px'}}>
            <Box sx={{padding:{md:'0px',xs:'0 30px'}}}>
            <p style={{fontSize:'1.5rem'}}>Recommended Videos</p></Box>
            <Slider {...sliderSettings}>
            
            
                {feeds.map((feed) => (
                    <CardComponent key={feed.id} id={feed.id} videoURL={feed.videoURL} title={feed.title} userName={feed.user.name} views={feed.views}/>
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