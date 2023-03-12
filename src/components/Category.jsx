import * as React from 'react'
import Box from '@mui/material/Box';
import {Link} from "react-router-dom"
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const icons=[
    {iconName : 'All' , path : './', title : 'All'},
    {iconName : 'Games' , path : './category/Games', title : 'Games'},
    {iconName : 'Funny' , path : './category/Funny', title : 'Funny'},
    {iconName : 'Music', path : './category/Music', title : 'Music'},
    {iconName :  'Movies', path : './category/Movies', title : 'Movies'},
    {iconName :  'Animals', path : './category/Animals', title : 'Animals'},
    {iconName :  'Nature', path : './category/Nature', title : 'Nature'}
]

function Category() {
  return (
    <>
        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'center',flexWrap:'wrap',gap:'10px'}}>
            {icons.map((icon)=> {return <Link to={icon.path} style={{color:'#fff',textDecoration:'none'}} title={icon.title} key={icon.title}>
                <Button className='category' aria-label="show more" aria-haspopup="true" color="inherit" sx={{margin:'10px 0',textDecoration:'none','&:hover':{backgroundColor:'#ffffff1a'},'&:focus':{backgroundColor:'#fff',color:'#000'}}}>
                <Typography sx={{fontSize:'1rem'}}>{icon.iconName}</Typography>
                </Button>
            </Link>
            })}
        
        </Box>
    </>
  )
}

export default Category