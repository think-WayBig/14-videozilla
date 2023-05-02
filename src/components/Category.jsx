import * as React from 'react'
// import Box from '@mui/material/Box';
import {Link } from "react-router-dom"
// import { Tabs, Tab } from '@mui/material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


// const theme = createTheme({
//     components:{
//       MuiButtonBase:{
//         styleOverrides:{
//         root:{
//           '&.MuiTab-root.Mui-selected': {
//               color: '#fff',
//               backgroundColor:'#fff3',
//               borderRadius:'10px',
//               padding:'0'
//             },
//             '&.MuiTab-root': {
//               minHeight:'24px'
//             },
//           }
//         }
//         }
//       }
     
//   });

// const icons=[
//     {iconName : 'All' , path : '../', title : 'All'},
//     {iconName : 'Games' , path : '../category/games', title : 'Games'},
//     {iconName : 'Funny' , path : '../category/funny', title : 'Funny'},
//     {iconName : 'Music', path : '../category/music', title : 'Music'},
//     {iconName :  'Movies', path : '../category/movies', title : 'Movies'},
//     {iconName :  'Animals', path : '../category/animals', title : 'Animals'},
//     {iconName :  'Nature', path : '../category/nature', title : 'Nature'}
// ]
const tabs = [
  {
    mainTab: "Entertainment",
    subMenuTabs: [
      { iconName: "Games", path: "../category/games", title: "Games" },
      { iconName: "Funny", path: "../category/funny", title: "Funny" },
      { iconName: "Music", path: "../category/music", title: "Music" },
      { iconName: "Movies", path: "../category/movies", title: "Movies" },
    ],
  },
  {
    mainTab: "Nature",
    subMenuTabs: [
      { iconName: "Animals", path: "../category/animals", title: "Animals" },
      { iconName: "Nature", path: "../category/nature", title: "Nature" },
    ],
  },
  // add more main tabs here...
];

// function Category() {
//   const [value, setValue] = React.useState(0);
//   // value = icons.findIndex((tab) => location.pathname === tab.path);
//   const handleChange = (_,newValue) =>{
//     setValue(newValue);
//   }
//   return (
    
//         <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',flexWrap:'wrap'}}>
//           <ThemeProvider theme={theme}>
//         <Box sx={{ maxWidth: { xs: 320, sm: 480,md:'100%' }}}>
        
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               indicatorColor='none'
//               sx={{ backgroundColor: 'transparent'}}
//             >
//               {icons.map((icon, index)=> {
//                 return <Tab key={index}
//                             label={icon.iconName}
//                             component={Link}
//                             to={icon.path}
//                             title={icon.title} 
//                             sx={{color:'#fff',padding:'12px !important'}}/>
//               })}
//             </Tabs>
            
//         </Box>
//         </ThemeProvider>
//         </Box>
   
//   )
// }

function Category(props) {
  const [selectedTab, setSelectedTab] = React.useState(null);

const handleMainTabEnter = (index) => {
  setSelectedTab(index);
};

const handleMainTabLeave = () => {
  setSelectedTab(null);
};

return (
  <Box sx={{display:'flex',flexDirection:{md:'row',xs:'column'}, gap:'20px'}}>
    {tabs.map((tab, index) => (
      <>
        <Typography key={index} onMouseEnter={() => handleMainTabEnter(index)}
        onMouseLeave={() => handleMainTabLeave()} style={{cursor:'pointer', display:'flex',position:'relative'}}>
          {tab.mainTab}<KeyboardArrowDownIcon/>
        {selectedTab === index && (
          <Box sx={{display:'flex',flexDirection:'column', position:'absolute',top:{md:'24px',xs:'24px'},left:'20px', zIndex:'1', color:{md:'#000000de', xs:'#fff'},background:{md:'#fff', xs:'#000000de'},padding:'8px 0', borderRadius:'4px'}}>
            {tab.subMenuTabs.map((subTab) => (
              <Link key={subTab.iconName} to={subTab.path} style={{ padding:'6px 30px 6px 16px', textDecoration:'none'}} onClick={props.handleCloseNavMenu}>
                <Typography sx={{color:{md:'#000000de', xs:'#fff'}}}>
                {subTab.iconName}
                </Typography>
              </Link>
              
            ))}
          </Box>
        )}
        </Typography>
        
      </>
    ))}
  </Box>
);
}


export default Category