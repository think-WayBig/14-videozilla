import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components:{
      MuiPaper:{
        styleOverrides:{
          root:{
          color:'#fff',
          backgroundColor:'#1a202c',
          },
          boxShadow:'none',
          
        }
      }
    },
    palette: {
      primary: {
        main: '#fff',
      },
      secondary: {
        main: '#f50057',
      },
      background: {
        default: '#1a202c',
      },
      
    },
    
  });

  export default theme;