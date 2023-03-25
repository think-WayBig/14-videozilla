import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    components:{
      MuiPaper:{
        styleOverrides:{
          root:{
          color:'#fff',
          backgroundColor:'#1a202c',
          padding:'0px'
          },
          boxShadow:'none',
        }
      },
      MuiTab:{
        root:{
          '&.Mui-selected': {
            color: '#ff470f', // replace with your desired selected text color
          },
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
        autofill: '#1a202c'
      },
      
    },
    
  });

  export default theme;