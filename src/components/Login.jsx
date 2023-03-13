import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useNavigate} from 'react-router-dom';
import db from '../firebase'; 
import { collection,query,getDocs, where } from "firebase/firestore";

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

export default function Login() {
  const [email,setEmail]=React.useState([]);
  const [password,setPassword]=React.useState([]);
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (email=="") {
      alert('Please enter your email.');
      return;
    }

    if (password=="") {
      alert('Please enter your password.');
      return;
    }
    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.empty){alert("Invalid email or password")}
    else{
      querySnapshot.docs.map((doc)=>{
        var data = doc.data();
        localStorage.setItem("uId", data.userId);
        alert("Login successful")
      navigate('/',{ replace: true });
      })
      
    }

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
         
          <Box component="form"  noValidate sx={{ mt: 1 ,padding:'24px 0'}}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="#" variant="body2" style={{color:'#fff', textDecoration:'none'}}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                {/* <Link to="/" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 2, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}