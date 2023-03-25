import { useLocation, useParams, useNavigate } from "react-router-dom";
import * as React from 'react';
import Box from '@mui/material/Box';
import db from '../firebase';
import { collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardComponent from "./CardComponent";
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';


const theme = createTheme({
  components:{
    MuiInputLabel: {
      styleOverrides: {
        input: {
            color: '#fff', // red input color
          },
          root: {
              '&:before': {
                color:'#fff' // color of the before pseudo-element
              },
              '&:after': {
                color:'#fff' // color of the after pseudo-element
              },
              '&:hover:not(.Mui-disabled):before': {
                color:'#fff' // color of the before pseudo-element on hover
              },
              '&.Mui-focused': {
                color:'#fff' // color of the before pseudo-element when focused
              },
              color:'#fff',
            },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
          notchedOutline: {
          borderColor: '#fff', // blue color
          },
          root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // blue color
              },
              '&:(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // blue color
              }, 
          },
      },
      },
      MuiInput: {
        styleOverrides: {
          input: {
            color: '#fff', // red input color
          },
          root: {
              '&:before': {
                borderBottom: '1px solid #fff', // color of the before pseudo-element
              },
              
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: '1px solid #fff', // color of the before pseudo-element on hover
              },
              
            },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(0, 0, 0, 0.36)" // Change the background color of MuiBackdrop-root
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.36)" // Change the background color of MuiDialog-backdrop
          }
        }
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0, // to remove box-shadow
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: '#1a202c',
            width:'70%',
            color:'#ded8d8',
            boxShadow: 'none', // to remove box-shadow
          },
        },
      },
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
function UserProfile() {
  const [feeds, setFeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { uId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = localStorage.getItem('uId');
  const [open, setOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState([]);
  const [videoId, setVideoId] = React.useState("");
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

  const handleClickOpen = (id) => {
    setOpen(true);
    setVideoId(id);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () =>{
    try {
      setLoading(true);
      const videoDocRef = doc(collection(db, "videos"), videoId);
      await updateDoc(videoDocRef, { title: newTitle });
      setSnackbar({
        open: true,
        message: 'Title updated successfully!',
      });
      setOpen(false);
      navigate('../profile/'+ uId)
      setLoading(false);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error updating video title`,
      });
      setLoading(false);
      console.error("Error updating video title: ", error);
    }
  }

  React.useEffect(() => {
    if(userId === uId){
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
        const userIds = fetchedFeeds.map((feed)=>feed.userId);
        const usersRef = collection(db, "users");
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
        setLoading(false);
      }
      fetchFeeds();
    }
    else{
      setSnackbar({
        open: true,
        message: "User not logged in",
      });
      // alert("User Not Logged in");
      navigate('/');
      setLoading(false)
    }
    
  }, [uId, location]);

  const filteredFeeds = React.useMemo(() => {
    return feeds.filter((feed) => feed.userId === uId);
  }, [feeds, uId]);


  return (
    <>
      {loading ? (
        <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
      ) : (
        <>
        <Box  sx={{display:'flex',flexWrap:'wrap',gap:'20px',padding:{md:"20px 25px",xs:'20px 0px'},justifyContent:{md:'left', xs:'center'}}}>
            {uId ? (
              filteredFeeds.map((feed) => (<div key={feed.id}>
                <CardComponent id={feed.id} videoURL={feed.videoURL} title={feed.title} views={feed.views} userName={feed.user.name} editIcon={<EditIcon onClick={()=>handleClickOpen(feed.id)} sx={{fontSize: '1.2rem',padding: '8px 5px', cursor:'pointer'}}/>} />
                <ThemeProvider theme={theme}>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Edit Title</DialogTitle>
                  <DialogContent>
                    
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Title"
                      type="text"
                      fullWidth
                      autoComplete="off"
                      variant="standard"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} sx={{color:'#ded8d8'}}>Close</Button>
                    <Button onClick={handleUpdate} sx={{color:'#ded8d8'}}>Update</Button>
                  </DialogActions>
                </Dialog>
           
                </ThemeProvider>
                </div>
              ))
              
            ) : (
              <p>No Doc Exists</p>
            )}
            <ThemeProvider theme={theme}>
                <Snackbar open={snackbar.open} message={snackbar.message} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{display:'block',position:'relative'}} />
              </ThemeProvider>
          </Box>
        </>
      )}
    </>
  );
}

export default UserProfile;