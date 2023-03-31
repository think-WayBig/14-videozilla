import { useLocation, useParams } from "react-router-dom";
import * as React from "react";
import Box from "@mui/material/Box";
import db from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardComponent from "./CardComponent";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";

const theme = createTheme({
  components: {
    MuiSnackbar: {
      styleOverrides: {
        root: {
          bottom: "0px",
          minWidth: "250px",
        },
      },
    },
  },
});
function UserDetails() {
  const [feeds, setFeeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { user } = useParams();
  const location = useLocation();
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
  });

  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  React.useEffect(() => {
    async function fetchFeeds() {
      setLoading(true);
      const q = query(
        collection(db, "users"),
        where("name", "==", user.slice(1))
      );
      const querySnapshot = await getDocs(q);
      const fetchedFeeds = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      const userIds = fetchedFeeds.map((feed) => feed.userId);
      if (userIds.length > 0) {
        const usersRef = collection(db, "videos");
        const usersQuery = query(usersRef, where("userId", "in", userIds));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map((doc) => doc.data());
        // Map video data to include user's name
        const feedsWithUsers = usersData.map((feed) => {
          const user = fetchedFeeds.find((user) => user.userId === feed.userId);
          return {
            ...feed,
            user,
          };
        });
        setFeeds(feedsWithUsers);
        setLoading(false);
      } else {
        setSnackbar({
          open: true,
          message: `${user.slice(1)} does not exist`,
        });

        setLoading(false);
      }
    }
    fetchFeeds();
  }, [user, location]);

  return (
    <>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            placeItems: "center",
          }}
        >
          {" "}
          <CircularProgress />{" "}
        </div>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              height: { md: "200px", xs: "130px" },
              overflow: "hidden",
              padding: { md: "0px", xs: "0px 20px" },
              marginBottom: "20px",
            }}
          >
            <img
              src="https://images.pexels.com/photos/1723637/pexels-photo-1723637.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              alt=""
              style={{ width: "100%" }}
            />
          </Box>
          {/* <Box sx={{padding:{md:'0px 40px',xs:'0px 40px'},marginTop:'-27px'}}>
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#c8c6c6",
              color: "#000",
              width: '45px',
              height: "45px",
              margin:'0 auto 20px'
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: "2.2rem" }} />
          </Avatar>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              padding: { md: "20px 25px", xs: "20px 0px" },
              justifyContent: { md: "left", xs: "center" },
            }}
          >
            {user ? (
              feeds.map((feed) => (
                <CardComponent
                  key={feed.id}
                  id={feed.id}
                  videoURL={feed.videoURL}
                  thumbnailURL={feed.thumbnailURL}
                  title={feed.title}
                  views={feed.views}
                  userName={feed.name}
                />
              ))
            ) : (
              <p>No Doc Exists</p>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              position: "fixed",
              bottom: "24px",
              zIndex: "1",
            }}
          >
            <ThemeProvider theme={theme}>
              <Snackbar
                open={snackbar.open}
                message={snackbar.message}
                autoHideDuration={2000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{ display: "block", position: "sticky" }}
              />
            </ThemeProvider>
          </Box>
        </Box>
      )}
    </>
  );
}

export default UserDetails;
