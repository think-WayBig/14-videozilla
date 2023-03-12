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
import { setDoc,doc } from "firebase/firestore";

import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";

const userId = localStorage.getItem("uId");
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

    const handleChange = (event) => {
        setCategory(event.target.value);
    };

    const [selectedFile, setSelectedFile] = React.useState(null);

    const handleFileSelect = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.type.includes("video/")) {
          setSelectedFile(file);
        } else {
          alert("Please upload a video file.");
        }
      };


    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        if (selectedFile == null) {alert("Please choose a file first!")};
        const videoRef = ref(storage, `/videos/${selectedFile.name}`);
        await uploadBytesResumable(videoRef, selectedFile);
        const downloadURL = await getDownloadURL(videoRef);
        await setDoc(doc(db, "videos", `${Date.now()}`), {
            title,
            category,
            id : `${Date.now()}`,
            videoURL: downloadURL,
            userId 
          });
        
            alert("Video uploaded successfully");
            navigate('/');
            setLoading(false);
      };

return (
    <>
        <Box sx={{width:{md:'60vw',xs:'80vw'},margin:'0 auto'}}>
        {loading ?(
               <div style={{width:'100%',height:'60vh',display:'flex',justifyContent:'center',placeItems:'center'}}> <CircularProgress/> </div>
        ) :(
            <Box sx={{border:'1px solid #fff',padding:'16px',borderRadius:'6px',color:'#fff', display:'flex', gap:4,flexDirection:'column'}}>
            <ThemeProvider theme={theme}>
                <TextField id="standard-basic" label="Title" variant="standard" value={title} onChange={(e) => setTitle(e.target.value)} />
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
                    <MenuItem value={'Movies'}>Movies</MenuItem>
                    <MenuItem value={'Animals'}>Animals</MenuItem>
                    <MenuItem value={'Music'}>Music</MenuItem>
                    <MenuItem value={'Nature'}>Nature</MenuItem>
                    </Select>
                </FormControl>
                
                <div className='MuiDropzoneArea-root'>
                    <div style={{ margin: "20px 0", width:'100%'}}>
                    {selectedFile ? <Paper className="paper" style={{background:'transparent',display:'flex',justifyContent:'center',boxShadow:'none'}}>
                                        <ReactPlayer url={URL.createObjectURL(selectedFile)} controls={true} />
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
            </ThemeProvider>
            </Box>
        )}
        </Box>
    </>
  )
}

export default Create