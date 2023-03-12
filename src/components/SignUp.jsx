import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import db from '../firebase';
import { setDoc,doc } from "firebase/firestore";

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
            
          },
      },
    },
  },
});

export default function SignUp() {
    const [name, setName] = React.useState([]);
    const [email, setEmail] = React.useState([]);
    const [password, setPassword] = React.useState([]);

    const uId = `${Date.now()}`;
    const handleSubmit = async (event) => {
    event.preventDefault();
    await setDoc(doc(db, "users", uId),{
        name,email,password,
        userId:uId
    })
    alert('Registration Successful')
    localStorage.setItem('uId',uId);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography> */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 ,padding:'24px 0'}}>
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
            />
            <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
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
            >
              Sign Up
            </Button>
            
          </Box>
        </Box>
        <Copyright sx={{ mt: 2, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}