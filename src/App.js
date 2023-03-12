import Home from './components/Home';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { Routes, Route, Navigate} from "react-router-dom";
import LoginSignupTab from './components/LoginSignupTab';

var userId = localStorage.getItem('uId');
function App() {
  return (
    <>
    <ThemeProvider theme={theme}>
    <Routes>
        <Route path="login" element={<LoginSignupTab/>} />
        <Route path="/*" element={userId!==null ?<Home/> : <Navigate replace to={"login"} />}/>
    </Routes>

    </ThemeProvider>
    </>
  );
}

export default App;
