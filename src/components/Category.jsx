import * as React from 'react'
import Box from '@mui/material/Box';
import {Link} from "react-router-dom"
import { Tabs, Tab } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    components:{
      MuiButtonBase:{
        styleOverrides:{
        root:{
          '&.MuiTab-root.Mui-selected': {
              color: '#fff',
              backgroundColor:'#fff3',
              borderRadius:'10px',
              padding:'0'
            },
            '&.MuiTab-root': {
              minHeight:'24px'
            },
          }
        }
        }
      }
     
  });

const icons=[
    {iconName : 'All' , path : '../', title : 'All'},
    {iconName : 'Games' , path : '../category/games', title : 'Games'},
    {iconName : 'Funny' , path : '../category/funny', title : 'Funny'},
    {iconName : 'Music', path : '../category/music', title : 'Music'},
    {iconName :  'Movies', path : '../category/movies', title : 'Movies'},
    {iconName :  'Animals', path : '../category/animals', title : 'Animals'},
    {iconName :  'Nature', path : '../category/nature', title : 'Nature'}
]

function Category() {
  const [value, setValue] = React.useState(0);
  // value = icons.findIndex((tab) => location.pathname === tab.path);
  const handleChange = (_,newValue) =>{
    setValue(newValue);
  }
  return (
    
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',flexWrap:'wrap'}}>
          <ThemeProvider theme={theme}>
        <Box sx={{ maxWidth: { xs: 320, sm: 480,md:'100%' }}}>
        
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              indicatorColor='none'
              sx={{ backgroundColor: 'transparent'}}
            >
              {icons.map((icon, index)=> {
                return <Tab key={index}
                            label={icon.iconName}
                            component={Link}
                            to={icon.path}
                            title={icon.title} 
                            sx={{color:'#fff',padding:'12px !important'}}/>
              })}
            </Tabs>
            
        </Box>
        </ThemeProvider>
        </Box>
   
  )
}

export default Category