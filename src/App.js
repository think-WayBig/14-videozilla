import Home from './components/Home';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { Routes, Route, Navigate} from "react-router-dom";
// import LoginSignupTab from './components/LoginSignupTab';
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {
var userId = localStorage.getItem('uId');

  return (
    <>
    <ThemeProvider theme={theme}>
    <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="signup" element={<SignUp/>} />
        <Route path="/*" element={userId!=null ?<Home/> : <Navigate replace to={"login"} />}/>
    </Routes>

    </ThemeProvider>
    </>
  );
}

export default App;
