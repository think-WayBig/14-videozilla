import * as React from 'react'
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Card from '@mui/material/Card';
import { useNavigate } from 'react-router-dom';



function CardComponent(props) {
    const navigate = useNavigate();
    const [isHovering, setIsHovering] = React.useState(false);

    const handleMouseEnter = (e) => {
      setIsHovering(true);
      e.target.play();
    };
  
    const handleMouseLeave = (e) => {
      setIsHovering(false);
      e.target.currentTime=0;
      e.target.pause();
    };

    const handleCardClick = (videoId) => {
        navigate('../videoDetail/' + videoId);
      };
    function getTimeDifference(timestamp) {
    const now = Date.now();
    const timeDiff = now - timestamp;
    const daysDiff = Math.floor(timeDiff / (24* 60 * 60 * 1000));
    const hoursDiff = Math.floor(timeDiff / (60 * 60 * 1000));
    const minutesDiff = Math.floor((timeDiff % (60 * 60 * 1000)) / (60 * 1000));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = Math.floor(daysDiff / 30);
    const yearsDiff = Math.floor(daysDiff / 365);
    
    if (yearsDiff > 0) {
      return `${yearsDiff} year${yearsDiff > 1 ? "s" : ""} ago`;
    } else if (monthsDiff > 0) {
      return `${monthsDiff} month${monthsDiff > 1 ? "s" : ""} ago`;
    } else if (weeksDiff > 0) {
      return `${weeksDiff} week${weeksDiff > 1 ? "s" : ""} ago`;
    } else if (daysDiff > 0) {
      return `${daysDiff} day${daysDiff > 1 ? "s" : ""} ago`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
    } else {
      return "Just now";
    }

}

  return (
    <Card
      
      sx={{
        maxWidth: { md: 330, xs: 280 },
        width: { md: 330, xs: 280 },
        boxShadow: "none",
        backgroundColor: "#1a202c",
      }}
    >
      <CardActionArea
        sx={{
          overflow: "hidden",
          "&:hover": { opacity: 1 },
          borderRadius: "10px",
        }}
        style={{ borderRadius: "10px" }}
        onClick={() => {
          handleCardClick(props.id);
        }}
      >
        <CardMedia
          component="video"
          alt="green iguana"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            "&:hover": {
              transform: "scale3d(1.05, 1.05, 1.05)",
              overflow: "hidden",
              opacity: 1,
            },
            background: "linear-gradient(177deg, #1c202e, black)",
            transition: "all 0.15s ease-in-out",
            border: "none",
            margin: "0px",
            width: "100%",
            objectFit: "cover",
            height: { md: "190px", xs: "160px" },
          }}
          src={props.videoURL}
          poster={props.thumbnailURL}
          muted
        />
      </CardActionArea>
      <CardContent
        sx={{
          padding: "8px 0px 0px",
          boxShadow: "none",
          borderEndEndRadius: "4px",
          backgroundColor: "transparent",
          display: "grid",
          gridTemplateColumns: "1fr",
        }}
      >
        <Box sx={{ gridColumn: "-3" }}>
          <Avatar
            sx={{
              m: 1,
              bgcolor: "#c8c6c6",
              color: "#000",
              marginRight: "10px",
              width: "35px",
              height: "35px",
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: "2rem" }} />
          </Avatar>
        </Box>
        <Box sx={{ gridColumn: 1 }}>
          <p
            style={{
              fontSize: "16px",
              padding: "0 15px",
              textAlign: "left",
              fontWeight: 400,
              maxHeight: "45px",
              color: "#fff",
              overflow: "hidden",
              margin: "5px 0",
              textTransform: 'capitalize'
            }}
          >
            {props.title}
          </p>

          <p
            style={{
              textTransform: "capitalize",
              marginTop: "0px",
              marginBottom: "5px",
              fontSize: "14px",
              padding: "0 15px",
              color: "#bfbfbf",
            }}
          >
            {props.userName}
          </p>

          <p
            style={{
              textTransform: "lowercase",
              marginTop: "0px",
              marginBottom: "5px",
              fontSize: "14px",
              padding: "0 15px",
              color: "#bfbfbf",
            }}
          >
            <span style={{ marginRight: "5px" }}>{props.views}</span>views
            <span style={{ margin: "auto 5px", fontWeight: "900" }}>.</span>
            {getTimeDifference(props.id)}
          </p>
        </Box>
        <Box sx={{gridColumn: 2, color:'#fff'}}>
          {props.editIcon}
        </Box>
      </CardContent>
    </Card>
  );
}

export default CardComponent;
