import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link , useNavigate} from 'react-router-dom';
import db from '../firebase';
import { setDoc,doc,query,where,getDocs,collection } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';

function Copyright(props) {
  return (
    <Typography variant="body2" color="inherit" align="center" {...props}>
      {'Copyright © '}
      <Link style={{textDecoration:'none',color:"#fff"}} to="/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

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
    MuiOutlinedInput: {
      styleOverrides: {
          notchedOutline: {
          borderColor: '#ffffffab', // blue color
          },
          root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffffffab', // blue color
              },
              '&:(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ffffffab', // blue color
              }, 
          },
      },
      },
      MuiCheckbox:{
        styleOverrides:{
          root:{
            color: '#ffffffab'
          }
        }
      },
      MuiSnackbar: {
        styleOverrides:{
          root: {
            bottom:'0px',
            width :'250px'
          },
        }
        
      },
      MuiInputBase:{
        styleOverrides:{
          input:{
            color: '#ffffffab',
          }
        }
      },
    MuiInput: {
      styleOverrides: {
        input: {
          color: '#fff', // red input color
        },
        root: {
            '&:before': {
              borderBottom: '1px solid #ffffffab', // color of the before pseudo-element
            },
            
            '&:hover:not(.Mui-disabled):before': {
              borderBottom: '1px solid #ffffffab', // color of the before pseudo-element on hover
            },
            '&:-internal-autofill-selected': {
              appearance: 'menulist-button',
              backgroundImage: 'none',
              backgroundColor: '#1a202c',
            },
          },
      },
    },
  },
});

export default function SignUp() {
    const navigate = useNavigate();
    const [name, setName] = React.useState([]);
    const [email, setEmail] = React.useState([]);
    const [password, setPassword] = React.useState([]);
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

    const uId = `${Date.now()}`;
    const handleSubmit = async (event) => {
    event.preventDefault();
    if (name=="") {
      setSnackbar({
        open: true,
        message: 'Please enter your name.',
      });
      return;
    }
    if (email=="") {
      setSnackbar({
        open: true,
        message: 'Please enter your email.',
      });
      return;
    }
    if (password=="") {
      setSnackbar({
        open: true,
        message: 'Please enter your password.',
      });
      return;
    }
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Email already exists in Firestore
      setSnackbar({
        open: true,
        message: 'Email already exists.',
      });
    }
    else{
    await setDoc(doc(db, "users", uId),{
        name,email,password,
        userId:uId
    })
    setSnackbar({
      open: true,
      message: 'Registration Successful.',
    });
    localStorage.setItem('uId',uId);
    setTimeout(function() {navigate('/login')},2000);
  }
  };

  return (
    <Box sx={{minHeight:'100vh',display:'flex',placeItems:'center',justifyContent:'center'}}>
    <Box sx={{ bgcolor: 'inherit', width: {md: '50%',xs:'80%'} }}>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Box
          sx={{display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
           <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 ,padding:'24px 0'}}>
          <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              autoComplete='off'
            />
            <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            type='email'
            name="email"
            autoComplete='off'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              autoComplete='off'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
            <Link to="../login" variant="body2" style={{color:'#fff',textDecoration:'none'}} className="loginSignupLink">
                  {"Already a User? Login Here"}
                </Link>
          </Box>
        <Copyright sx={{ mt: 2, mb: 4 }} />
        </Box>
      </Container>
      <Snackbar open={snackbar.open} message={snackbar.message} autoHideDuration={2000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{display:'block',position:'relative'}}/>
    </ThemeProvider>
    </Box>
    </Box>
  );
}