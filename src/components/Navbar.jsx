import * as React from 'react';
import {Link,useNavigate} from "react-router-dom"
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
// import logo from '../../src/img/logo.751bfa4655891153aaf8.png';

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
          marginLeft:'-10px'
          
        },
      }}
    >
  <MenuItem onClick={()=>handleMyAccount(`${uId}`)}>My account</MenuItem>
      <MenuItem onClick={()=>{handleMenuClose(); localStorage.removeItem('uId');setTimeout(function() {navigate('login')},1000);}}>Logout</MenuItem>
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
      
      <Link to='/create' style={{textDecoration:'none'}}><MenuItem sx={{padding:'0px 16px'}}>
      <IconButton
      size="large"
            color="inherit">
            <AddBoxIcon  sx={{color:'#000000de'}}/>
        </IconButton>
        <p style={{color:'#000000de'}}>Create</p>
      </MenuItem></Link>
      <MenuItem onClick={handleProfileMenuOpen} sx={{padding:'0px 16px'}}>
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
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1,backgroundColor:"#1a202c"}}>
      <AppBar position="static" sx={{backgroundColor: '#1a202c', boxShadow:'none' , padding:'16px'}}>
        <Toolbar>
          <Box sx={{flexGrow:1,marginRight:{xs:'20px'},display:"flex"}}>
          {/* <Link to='/'><img src={logo} width="150px" alt='logo' title='Home'/></Link> */}
            <Link to='/' style={{color:'inherit',textDecoration:'none'}}><p title='Home' style={{fontSize:'1.6rem',margin:'0px'}}>VideoZilla</p></Link>
          </Box>
          <Search sx={{flexGrow:{xs:0.8,md:1},marginRight:{xs:'5px'}}}>
            <SearchIconWrapper sx={{paddingLeft:{xs:'20px'}}}>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }} />
          </Search>

          <Box sx={{ display: { xs: 'none', md: 'flex' } , flexGrow:{xs:0.5,md:1} , justifyContent:'end'}}>
            
            <IconButton
              color="inherit">
                <Link to='/create' style={{display:'flex'}}><AddBoxIcon sx={{fontSize: '1.8em',color:'#fff'}}/></Link>
            </IconButton>
            <IconButton
              
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit">
              <AccountCircle sx={{fontSize: '1.8em'}}/>
            </IconButton>
          
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit">
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}