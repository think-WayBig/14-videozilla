import * as React from 'react';
import {Link,useNavigate} from "react-router-dom"
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button  from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import TextField from "@mui/material/TextField";
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import LoginIcon from '@mui/icons-material/Login';
import LockOpenIcon from '@mui/icons-material/LockOpen';
// import logo from '../../src/img/logo.751bfa4655891153aaf8.png';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import DialogComponent from './DialogComponent';
import Category from './Category';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from "@mui/material/Drawer";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";

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

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '80%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '80%',
    [theme.breakpoints.up('lg')]: {
      width: '50ch',
    },
  },
}));

export default function Navbar() {
const uId = localStorage.getItem('uId');
const [searchValue, setSearchValue] = React.useState([]);
const [openDrawer, setStateDrawer] = React.useState(false);

  
  /*
  function that is being called every time the drawer should open or close,
  the keys tab and shift are excluded so the user can focus between
  the elements with the keys
  */
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    //changes the function state according to the value of open
    setStateDrawer(open);
  };
  const handleCloseNavMenu = () => {
    setStateDrawer(false)
   };

const [snackbar, setSnackbar] = React.useState({
  open: false,
  message: "",
});
const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () =>{
      setOpen(true);
  };

const [open2, setOpen2] = React.useState(false);
const handleClose2 = () => {
  setOpen2(false);
};

const handleClickOpen2 = () =>{
    setOpen2(true);
};

const handleSnackbarClose = () => {
  setSnackbar({
    ...snackbar,
    open: false,
  });
};
const handleSearchChange = (event) => {
  setSearchValue(event.target.value);
};

const handleSearchKeyPress = async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const newLocation = {
      pathname: '/search',
      search: `title=${searchValue}`,
    };
    navigate(newLocation);
    setOpen2(false);
  }
};

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logout = () =>{
    setOpen(false);
    localStorage.removeItem('uId');
    setSnackbar({
      open: true,
      message: `Logout successful.`,
    });
    setTimeout(function() {navigate('/')},2000);
  }

  const handleMyAccount = (uId) => {
    navigate('./profile/'+ uId)
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: '150px',
          marginTop:'58px',
          marginLeft:'-10px',
        },
      }}
    >
    <MenuItem style={{display:'flex',justifyContent:'flex-start',padding:'6px 16px'}} onClick={()=>handleMyAccount(`${uId}`)}>My account</MenuItem>
    <MenuItem style={{display:'flex',justifyContent:'flex-start',padding:'6px 16px'}} onClick={()=>{handleMenuClose(); handleClickOpen();}}>Logout</MenuItem>
    <DialogComponent open={open} handleClose={handleClose} title="Are you sure you want to logout?" btn1="Cancel" btn2="Logout" handlefunction={logout} />
  </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={{
        style: {
          maxHeight: 400,
          width: '150px',
          marginTop:'58px',
          marginLeft:'-10px'
        },
      }}
    >
      {uId==null ? <><Link to='/login' style={{textDecoration:'none',color:'#000000de'}}><MenuItem sx={{padding:'0px 16px'}}>
      <IconButton
      size="large"
            color="inherit">
            <LockOpenIcon  sx={{color:'#000000de'}}/>
        </IconButton>
        <p style={{color:'#000000de !important'}}>Login</p>
      </MenuItem></Link>
      <Link to='/signup' style={{textDecoration:'none'}}><MenuItem sx={{padding:'0px 16px'}}>
      <IconButton
      size="large"
            color="inherit">
            <LoginIcon  sx={{color:'#000000de'}}/>
        </IconButton>
        <p style={{color:'#000000de'}}>Signup</p>
      </MenuItem></Link></> : " "}
      {uId == null ? <Link to='/login' style={{textDecoration:'none'}}><MenuItem sx={{padding:'0px 16px'}}>
      <IconButton
      size="large"
            color="inherit">
            <AddBoxIcon  sx={{color:'#000000de'}}/>
        </IconButton>
        <p style={{color:'#000000de'}}>Create</p>
      </MenuItem></Link> : <Link to='/create' style={{textDecoration:'none'}}><MenuItem sx={{padding:'0px 16px'}}>
      <IconButton
      size="large"
            color="inherit">
            <AddBoxIcon  sx={{color:'#000000de'}}/>
        </IconButton>
        <p style={{color:'#000000de'}}>Create</p>
      </MenuItem></Link> }
      {uId !== null ? <MenuItem onClick={handleProfileMenuOpen} sx={{padding:'0px 16px'}}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>:""}
    </Menu>
  );
  

  return (
    <>
    <Box sx={{ flexGrow: 1,backgroundColor:"#1a202c"}}>
      <AppBar position="static" sx={{backgroundColor: '#1a202c', boxShadow:'none' , padding:{md:'16px',xs:'16px 0px'}}}>
        <Toolbar sx={{backgroundColor:'#1a202c'}}>

          <Box sx={{marginRight:'0px',display:{md:"flex", xs:'none'}, flexGrow:{xs:1,md:'0.2'}, justifyContent:{md:'left', xs:'center'}}}>
          {/* <Link to='/'><img src={logo} width="150px" alt='logo' title='Home'/></Link> */}
            <Link to='/' style={{color:'inherit',textDecoration:'none'}}><p title='Home' style={{fontSize:'1.6rem',margin:'0px'}}>VideoZilla</p></Link>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            
            <IconButton 
              edge="end" 
              color="#07294d" 
              aria-label="open drawer" 
              onClick={toggleDrawer(true)}
              sx={{ 
                
                display: {
                  xs: 'block',
                  md: 'none',
                },
                color:"#fff !important"
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* The outside of the drawer */}
            <Drawer
              //from which side the drawer slides in
              anchor="left"
              //if open is true --> drawer is shown
              open={openDrawer}
              //function that is called when the drawer should close
              onClose={toggleDrawer(false)}
              //function that is called when the drawer should open
              onOpen={toggleDrawer(true)}
              sx={{}}
            >
                {/* The inside of the drawer */}
                <Box sx={{
                  px:3,
                  height: 1,
                  width: '300px',
                  backgroundColor: "#fff",
                  marginTop:'60px'
                }}>

                  {/* 
                  when clicking the icon it calls the function toggleDrawer 
                  and closes the drawer by setting the variable open to false
                  */}
                  <IconButton sx={{mb: 2}}>
                    <CloseIcon onClick={toggleDrawer(false)} />
                  </IconButton>

                  <Divider sx={{mb: 2}} />

                  <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' },}}>
                    <Category handleCloseNavMenu={handleCloseNavMenu}/>
                  </Box>        
                </Box>
              
            </Drawer>
          </Box>
          <Box sx={{marginRight:'0px',display:{md:"none", xs:'flex'}, flexGrow:{xs:1,md:'0.1'}, justifyContent:{md:'left', xs:'center'}}}>
          {/* <Link to='/'><img src={logo} width="150px" alt='logo' title='Home'/></Link> */}
            <Link to='/' style={{color:'inherit',textDecoration:'none'}}><p title='Home' style={{fontSize:'1.6rem',margin:'0px'}}>VideoZilla</p></Link>
          </Box>
          <Box flexGrow='1' sx={{display:{md:'flex',xs:'none'}, marginTop: '11px'}}>
            <Category/>
          </Box>
          <Box sx={{flexGrow:1,justifyContent:'right',display:{md:'flex',xs:'none'}}}>
          <Search sx={{marginRight:{xs:'30px'}}}>
            <SearchIconWrapper sx={{paddingLeft:{xs:'20px'}}}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchValue}
              onInput={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              inputProps={{ 'aria-label': 'search' }}
               />
          </Search>
        </Box>
        <Box sx={{justifyContent:'center',display:{md:'none',xs:'flex'}}}>
            <Link style={{color:'inherit',textDecoration:'none', display:'flex'}} onClick={()=>{handleClickOpen2();}}><SearchIcon /></Link>
            <DialogComponent open={open2} handlefunction={handleClose2} title="Search" btn2="Cancel" textfield={
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        placeholder="Search…"
                        value={searchValue}
                        type="text"
                        fullWidth
                        autoComplete="off"
                        variant="standard"
                        onInput={handleSearchChange}
                        onKeyPress={handleSearchKeyPress}
                        sx={{marginBottom:'40px'}}
                      />} />

          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' } , justifyContent:'end'}}>
            {uId == null ? <Box id="userlog" sx={{display:'flex', placeItems:'center', gap:'10px'}}>
              <Link to='login' style={{textDecoration:'none'}}><Button sx={{background:'#fff !important',color:'#333 !important',border:'1px solid #fff !important', fontWeight:'600 !important', padding:'6px 8px !important', borderRadius:'4px !important','&:hover':{backgroundColor:'transparent !important',color:"#fff !important",border:'1px solid #fff !important',fontWeight:'500 !important'}}}>Login</Button></Link>
              <Link to="signup" style={{textDecoration:'none'}}><Button sx={{background:'#fff !important',color:'#333 !important',border:'1px solid #fff !important', fontWeight:'600 !important', padding:'6px 8px !important', borderRadius:'4px !important','&:hover':{backgroundColor:'transparent !important',color:"#fff !important",border:'1px solid #fff !important',fontWeight:'500 !important'}}}>Signup</Button> </Link>
            </Box>
            : ""}
            <IconButton
              color="inherit" sx={{display:'flex'}}>
                {uId==null? <Link to='/login' style={{display:'flex'}} title="Create"><AddBoxIcon sx={{fontSize: '1.8em !important',color:'#fff'}}/></Link>
                : <Link to='/create' style={{display:'flex'}} title="Create"><AddBoxIcon sx={{fontSize: '1.8em !important',color:'#fff'}}/></Link>
                }
            </IconButton>
            { uId==null ? "" : <IconButton
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              id="profileicon"
              sx={{display:'flex'}}>
              <AccountCircle sx={{fontSize: '1.8em !important'}}/>
            </IconButton> }
          
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{padding:'12px 0px'}}>
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      
    </Box>
    <Box sx={{display:'flex',justifyContent:'center',width:'100%',position:'fixed',bottom:'24px',zIndex:'1'}}>
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