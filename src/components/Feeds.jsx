import { useLocation, useParams } from "react-router-dom";
import * as React from 'react'
import Box from '@mui/material/Box';
import db from '../firebase';
import { collection, getDocs, query, where} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardComponent from "./CardComponent";
// import Category from './Category';

function Feeds() {
  const [feeds, setFeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { categoryId } = useParams();
  const location = useLocation();

  React.useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      const q = categoryId
        ? query(collection(db, "videos"), where("category", "==", categoryId))
        : query(collection(db, "videos"));
      const querySnapshot = await getDocs(q);
      const fetchedFeeds = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
       // Retrieve user data for each video
    const userIds = fetchedFeeds.map((feed) => feed.userId);
    const usersRef = collection(db, "users");
    if(userIds.length > 0) {
      const usersQuery = query(usersRef, where("userId", "in", userIds)) ;
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
  
      // Map video data to include user's name
      const feedsWithUsers = fetchedFeeds.map((feed) => {
        const user = usersData.find((user) => user.userId === feed.userId);
        return {
          ...feed,
          user,
        };
      });
      setFeeds(feedsWithUsers);
      
    }
    setLoading(false);
    }
    fetchFeeds();
  }, [categoryId, location]);

  const filteredFeeds = React.useMemo(() => {
    return feeds.filter((feed) => feed.category === categoryId);
  }, [feeds, categoryId]);

  
  return (
    <Box sx={{flexGrow:1}}>
    {/* <Box sx={{padding:'10px' , display:'flex', justifyContent:'center',flexWrap:'wrap',margin:'-30px 0 40px 0'}}>
           <Category/>   
    </Box> */}
      {loading ? (
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
      ) : (
        <>
        <Box  sx={{display:'flex',flexWrap:'wrap',gap:'10px 20px',padding:{md:"20px 0",xs:'20px 0px'},justifyContent:{md:'start',xs:'center'}}}>
            {categoryId ? (
              filteredFeeds.map((feed) => (
                <CardComponent key={feed.id} id={feed.id} videoURL={feed.videoURL} thumbnailURL={feed.thumbnailURL} title={feed.title} userName={feed.user.name} views={feed.views}/>
                    
              ))
            ) : (
              feeds.map((feed) => (
                <CardComponent key={feed.id} id={feed.id} videoURL={feed.videoURL} thumbnailURL={feed.thumbnailURL} title={feed.title} userName={feed.user.name} views={feed.views}/>
              ))
            )}
          </Box>
        </>
      )}
    </Box>
  );
}

export default Feeds;