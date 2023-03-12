import * as React from 'react'
import Box from '@mui/material/Box';
import db from '../firebase';
import { collection, getDocs, query, where} from "firebase/firestore";
import { useParams , useLocation,Link } from "react-router-dom";
import CardCover from '@mui/joy/CardCover';
import CircularProgress from "@material-ui/core/CircularProgress";
import HomeIcon from '@mui/icons-material/Home';


function VideoDetail() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [video , setVideo] = React.useState([]);
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
      

  return (
    <>
    {isLoading ?(
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
    ):(
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
            {/* <Box sx={{flexGrow:1}}></Box> */}
        </Box>
    )
    }
    </>
    )
}

export default VideoDetail