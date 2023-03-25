import Home from './components/Home';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import { Routes, Route} from "react-router-dom";
import Login from './components/Login';
import SignUp from './components/SignUp';

function App() {

  return (
    <>
    <ThemeProvider theme={theme}>
    <Routes>
    <Route path="login" element={<Login/>} />
        <Route path="signup" element={<SignUp/>} />
        <Route path="/*" element={<Home/>} />
        
    </Routes>

    </ThemeProvider>
    </>
  );
}

export default App;
