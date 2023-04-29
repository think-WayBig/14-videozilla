import { useLocation, useParams, useNavigate } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import db from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardComponent from "./CardComponent";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import DialogComponent from "./DialogComponent";
import { storage } from "../firebase";
import { v4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import Avatar from "@mui/material/Avatar";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Typography } from "@mui/material";

const theme = createTheme({
  components: {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: "0px",
          minWidth: "250px",
        },
      },
    },
  },
});
function UserProfile() {
  const [feeds, setFeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { uId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem("uId");
  const [open, setOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState([]);
  const [videoId, setVideoId] = React.useState("");
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
  });
  const [thumbnail, setThumbnail] = React.useState(null);


  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const handleClickOpen = (id) => {
    setOpen(true);
    setVideoId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if(thumbnail){
      const thumbnailFileName = thumbnail.name + v4();
      const thumbnailRef = ref(storage, `/thumbnails/${thumbnailFileName}`);
      
      if(thumbnailRef && newTitle.length !== 0){
        const videoDocRef = doc(collection(db, "videos"), videoId);
        const videoDoc = await getDoc(videoDocRef);
        const prevThumbnailFileName = videoDoc.data().thumbnailFileName;
        if (prevThumbnailFileName) {
          const prevThumbnailRef = ref(storage, `/thumbnails/${prevThumbnailFileName}`);
          await deleteObject(prevThumbnailRef); // delete the previous thumbnail image
        }
        await uploadBytesResumable(thumbnailRef, thumbnail);
        const thumbnailDownloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(videoDocRef, { 
          title: newTitle.toLowerCase(),
          thumbnailFileName,
          thumbnailURL: thumbnailDownloadURL, });
        setSnackbar({
          open: true,
          message: "Updated successfully!",
        });
      }
      else if(thumbnailRef){
        const videoDocRef = doc(collection(db, "videos"), videoId);
        const videoDoc = await getDoc(videoDocRef);
        const prevThumbnailFileName = videoDoc.data().thumbnailFileName;
        if (prevThumbnailFileName) {
          const prevThumbnailRef = ref(storage, `/thumbnails/${prevThumbnailFileName}`);
          await deleteObject(prevThumbnailRef); // delete the previous thumbnail image
        }
        await uploadBytesResumable(thumbnailRef, thumbnail);
        const thumbnailDownloadURL = await getDownloadURL(thumbnailRef);
        await updateDoc(videoDocRef, { 
          thumbnailFileName,
          thumbnailURL: thumbnailDownloadURL, });
        setSnackbar({
          open: true,
          message: "Updated successfully!",
        });
      }
    }
      else if(newTitle.length !== 0){
        const videoDocRef = doc(collection(db, "videos"), videoId);
        await updateDoc(videoDocRef, { title: newTitle.toLowerCase() });
        setSnackbar({
          open: true,
          message: "Title updated successfully!",
        });
      }
      setOpen(false);
      navigate("../profile/" + uId);
      setLoading(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating video title`,
      });
      setLoading(false);
      console.error("Error updating video title: ", error);
    }
  };

  React.useEffect(() => {
    if (userId === uId) {
      async function fetchFeeds() {
        setLoading(true);
        const q = query(collection(db, "videos"), where("userId", "==", uId));
        const querySnapshot = await getDocs(q);
        const fetchedFeeds = querySnapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        const userIds = fetchedFeeds.map((feed) => feed.userId);
        if(userIds.length > 0){
          const usersRef = collection(db, "users");
          const usersQuery = query(usersRef, where("userId", "in", userIds));
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
          setLoading(false);
        }else{
          const userRef = doc(db, "users", uId);
          const userSnapshot = await getDoc(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            console.log([userData]);
            setFeeds([userData]);
            setLoading(false);
            // Do something with the user data here...
          } else {
            // Handle the case when the document doesn't exist here...
            setLoading(false);
            alert('Please upload a feed');
          }
        }
        
      }
      fetchFeeds();
    } else {
      setSnackbar({
        open: true,
        message: "User not logged in",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
      setLoading(false);
    }
  }, [uId, location]);
  
  const filteredFeeds = React.useMemo(() => {
    return feeds.filter((feed) => feed.userId === uId);
  }, [feeds, uId]);

  let videos =0;

  if(filteredFeeds.length > 1) {
    videos = `${filteredFeeds.length} videos`;
  }else if(filteredFeeds.length = 1) {
    videos = `${filteredFeeds.length} video`;
  }else if(filteredFeeds.length < 0) {
    videos = `0 video`;
  }
  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            placeItems: "center",
          }}
        >
          {" "}
          <CircularProgress />{" "}
        </div>
      ) : (
        <>
        <Box sx={{flexGrow:1}}>
          <Box
            sx={{
              height: { md: "200px", xs: "130px" },
              overflow: "hidden",
              padding: { md: "0px", xs: "0px 20px" },
              marginBottom: "20px",
            }}
          >
            <img
              src="https://images.pexels.com/photos/1723637/pexels-photo-1723637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              style={{ width: "100%" }}
            />
          </Box>
          <Box sx={{padding:{md:'0px 40px',xs:'0px 40px'}, display:'flex', marginTop:'-47px',flexDirection:'column'}}>
            <Box sx={{padding:'0px 15px'}}>
            <Avatar
            sx={{
              m: 1,
              bgcolor: "#c8c6c6",
              color: "#000",
              width: '55px',
              height: "55px",
              margin:'0 auto 20px'
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: "2.2rem" }} />
          </Avatar>
            </Box>
          
          <Box sx={{padding:'0px 15px', flexGrow:'1',display:'flex', gap:'8px',marginBottom:'20px', justifyContent:'center'}}>
              {/* {feeds[0].name ? <Typography style={{textTransform:'capitalize',margin:'0px', fontWeight:'500'}}>{feeds[0].name}</Typography> : <Typography style={{textTransform:'capitalize',margin:'0px', fontWeight:'500'}}>{feeds[0].user.name}</Typography>} */}
             <Typography style={{textTransform:'capitalize',margin:'0px', fontWeight:'500'}}>{feeds[0].name?feeds[0].name:feeds[0].user.name}</Typography> 
              <span style={{borderRight:'1px solid #fff'}}></span>
              <Typography style={{textTransform:'capitalize',margin:'0px', fontWeight:'500'}}>{feeds[0].name? "0 video" : videos}</Typography>

          </Box>
          </Box>
          {/* <Box sx={{}}>
            <Typography style={{margin:'20px 0px'}}> Videos</Typography>
            <hr />
          </Box> */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              padding: { md: "20px 25px", xs: "20px 0px" },
              justifyContent: { md: "left", xs: "center" },
            }}
          >
            {uId ? (
              filteredFeeds.map((feed) => {return feed.title ?
                <div key={feed.id}>
                  <CardComponent
                    id={feed.id}
                    videoURL={feed.videoURL}
                    thumbnailURL={feed.thumbnailURL}
                    title={feed.title}
                    views={feed.views}
                    userName={feeds[0].user ? feeds[0].user.name : null}
                    editIcon={
                      <EditIcon
                        onClick={() => handleClickOpen(feed.id)}
                        sx={{
                          fontSize: "1.2rem",
                          padding: "8px 5px",
                          cursor: "pointer",
                        }}
                      />
                    }
                  />

                  <DialogComponent
                    open={open}
                    handleClose={handleClose}
                    title="Are you sure you want to delete?"
                    btn1="Close"
                    btn2="Update"
                    handlefunction={handleUpdate}
                    textfield={
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Title"
                        type="text"
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        onChange={(e) => setNewTitle(e.target.value)}
                        sx={{marginBottom:'40px'}}
                      />
                    }
                    uploadThumbnail={
                      <Box sx={{ display: "flex", gap: "20px" }}>
                        <Button
                          variant="contained"
                          component="label"
                          onChange={(e) => setThumbnail(e.target.files[0])}
                          sx={{
                            backgroundColor: "#fff",
                            color: "#333",
                            fontWeight: "700",
                            textTransform: "capitalize",
                            fontSize: "16px",
                            width: { md: "12vw", xs: "130px" },
                            "&:hover": { backgroundColor: "#fff" },
                          }}
                        >
                          Upload Thumbnail
                          <input
                            type="file"
                            accept="image/jpg , image/jpeg"
                            hidden
                          />
                        </Button>
                        {thumbnail && (
                          <img
                            src={URL.createObjectURL(thumbnail)}
                            alt="thumbnail"
                            width="40px"
                            height="40px"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                        {/* <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} /> */}
                      </Box>
                    }
                  />
                </div>:
                  <p style={{textAlign:'center', flexGrow:'1'}}>0 videos uploaded</p>
                
              })
            ) : (
              <p>No Doc Exists</p>
            )}
          </Box>
          </Box>
        </>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "fixed",
          bottom: "24px",
          zIndex: "1",
        }}
      >
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

export default UserProfile;
