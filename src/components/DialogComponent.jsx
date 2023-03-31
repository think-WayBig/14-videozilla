import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  components:{
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
          borderColor: '#fff', // blue color
          },
          root: {
              '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // blue color
              },
              '&:(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // blue color
              }, 
          },
      },
      },
      MuiInput: {
        styleOverrides: {
          input: {
            color: '#fff', // red input color
          },
          root: {
              '&:before': {
                borderBottom: '1px solid #fff', // color of the before pseudo-element
              },
              
              '&:hover:not(.Mui-disabled):before': {
                borderBottom: '1px solid #fff', // color of the before pseudo-element on hover
              },
              
            },
        },
      },
      MuiBackdrop: {
        styleOverrides: {
          root: {
            backgroundColor: "rgba(0, 0, 0, 0.66)" // Change the background color of MuiBackdrop-root
          }
        }
      },
      MuiDialog: {
        styleOverrides: {
          backdrop: {
            backgroundColor: "rgba(0, 0, 0, 0.66)" // Change the background color of MuiDialog-backdrop
          },
          paper: {
            backgroundColor: '#1a202c',
            width:'70%',
            color:'#ded8d8',
            boxShadow: 'none', // to remove box-shadow
          },
        }
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0, // to remove box-shadow
        },
      },
      
      
  }
});

function DialogComponent(props) {
  
  return (
    <ThemeProvider theme={theme}>
    <Dialog open={props.open} onClose={props.handleClose}>
                  <DialogTitle>{props.title}</DialogTitle>
                  <DialogContent>
                    {props.textfield}
                    {props.uploadThumbnail}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={props.handleClose} sx={{color:'#ded8d8'}}>{props.btn1}</Button>
                    <Button onClick={props.handlefunction} sx={{color:'#ded8d8'}}>{props.btn2}</Button>
                  </DialogActions>
                </Dialog>
                </ThemeProvider>
  )
}

export default DialogComponent