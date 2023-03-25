import * as React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles'; 
import Button from '@mui/material/Button';
import Dropzone from "react-dropzone";
import ReactPlayer from "react-player";
import Paper from "@material-ui/core/Paper";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from 'react-router-dom';
import { storage } from '../firebase';
import db from '../firebase';
import Snackbar from '@mui/material/Snackbar';
import { setDoc,doc } from "firebase/firestore";
import { v4 } from "uuid";

import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";


const theme = createTheme({
    components: {
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
        MuiSelect: {
            styleOverrides: {
                '&.MuiOutlinedInput-notchedOutline': {
                  border: '1px solid #fff', // blue color
              },
              select: {
                
                color:'#fff'
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
        MuiSnackbar: {
          styleOverrides:{
            root: {
              bottom:'0px' ,
              width :'250px'
            },
          }
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
      },
});

function Create() {
    const [title, setTitle] = React.useState('');
    const [category, setCategory] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const userId = localStorage.getItem("uId");
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

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const [selectedFile, setSelectedFile] = React.useState(null);

    const handleFileSelect = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.type.includes("video/mp4")) {
          setSelectedFile(file);
        } else {
          alert("Please upload a .mp4 file.");
        }
      };

    const playerConfig = {
      file: {
        attributes: {
          controlsList: "nodownload",
        },
      },
    };
    const id = `${Date.now()}`;
    const handleSubmit = async (e) => {
      if(!userId){
        navigate('/login');
      }
        if (title=="") {
          setSnackbar({
            open: true,
            message: 'Title is required.',
          });
          return;
        }
        
          setLoading(true);
          e.preventDefault();
          if (selectedFile == null) {alert("Please choose a file first!"); setLoading(false)};
          const fileName = selectedFile.name+v4();
          const videoRef = ref(storage, `/videos/${fileName}`);
          await uploadBytesResumable(videoRef, selectedFile);
          const downloadURL = await getDownloadURL(videoRef);
          await setDoc(doc(db, "videos", id), {
              title,
              category,
              id:id,
              videoURL: downloadURL,
              videoName : fileName,
              userId 
            });
            setSnackbar({
              open: true,
              message: 'Video uploaded successfully',
            });
              // alert("Video uploaded successfully");
              navigate('/');
              setLoading(false);
      
      
      };

return (
    <Box sx={{display:'flex',flexDirection:'column',flexGrow:1}}>
        <Box sx={{width:{md:'60vw',xs:'80vw'},margin:'0 auto'}}>
        {loading ?(
               <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',flexDirection:'column',gap:4,placeItems:'center'}}> <CircularProgress/> Uploading Video...</div>
        ) :(
          <ThemeProvider theme={theme}>
            <Box sx={{border:'1px solid #fff',padding:'16px',borderRadius:'6px',color:'#fff', display:'flex', gap:4,flexDirection:'column'}}>
            
                <TextField autoComplete='off' id="standard-basic" label="Title" variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} />
                <FormControl fullWidth >
                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={category}
                    label="Category"
                    onChange={handleChange}
                    >
                    <MenuItem value={'Games'}>Games</MenuItem>
                    <MenuItem value={'Funny'}>Funny</MenuItem>
                    <MenuItem value={'Music'}>Music</MenuItem>
                    <MenuItem value={'Movies'}>Movies</MenuItem>
                    <MenuItem value={'Animals'}>Animals</MenuItem>
                    <MenuItem value={'Nature'}>Nature</MenuItem>
                    </Select>
                </FormControl>
                
                <div className='MuiDropzoneArea-root'>
                    <div style={{ margin: "20px 0", width:'100%'}}>
                    {selectedFile ? <Paper className="paper" style={{background:'transparent',display:'flex',justifyContent:'center',boxShadow:'none',width:'auto'}}>
                                        <ReactPlayer className='reactPlayer' url={URL.createObjectURL(selectedFile)} controls={true} style={{display:'flex',height:'auto',padding:'0 20px'}} config={playerConfig}/>
                                    </Paper>
                                  : <Dropzone onDrop={handleFileSelect}>
                                        {({ getRootProps, getInputProps }) => (
                                            <div {...getRootProps()} className="dropzone" style={{cursor:'pointer',padding:'50px 0'}}>
                                            <input {...getInputProps()}/>
                                            <Typography variant="h5" sx={{fontSize:{md:'25px',xs:'17px'}}}>
                                            Drag and Drop Video File Here
                                            </Typography>
                                            <Typography variant="subtitle1" sx={{fontSize:{md:'20px',xs:'14px'}}}>
                                            Or click to select a file 
                                            </Typography>
                                            <CloudUploadIcon style={{ fontSize: '2.5rem',cursor:'pointer' }} />
                                            </div>
                                        )}
                                    </Dropzone>}
                    </div>
                </div>
                <Button variant="contained" sx={{backgroundColor:'#9bdaf3',color:'#333',fontWeight:'700',textTransform:'capitalize',fontSize:'18px',width:{md:'12vw',xs:'130px'},'&:hover':{backgroundColor:'#9bdaf3'}}} onClick={handleSubmit}>Upload</Button>
            </Box>
            </ThemeProvider>
        )}
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',flexGrow:1}}>
        <ThemeProvider theme={theme}>
        <Snackbar open={snackbar.open} message={snackbar.message} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{display:'block',position:'relative'}} />
        </ThemeProvider>
        </Box>
    </Box>
  )
}

export default Create