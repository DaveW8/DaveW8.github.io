import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import taiwan from "../images/Taiwan.jpg";
import uk from "../images/UK.jpg";
import hawaii from "../images/Hawaii.jpg";
import singapore from "../images/Singapore.jpg";
import { useNavigate } from 'react-router-dom';

export default function TravelHub() {
  const navigate = useNavigate();

  return (
    <Grid container columns={4}>
      <Slide direction="down" in={true} timeout={2000} mountOnEnter unmountOnExit>
        <Grid container sx={{
            backgroundImage: `url(${taiwan})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} xs={3} className="trip-page-column">
          <div className="trip-page-button">
            <Button variant="contained" onClick={() => {
              console.log("Clicked on Taiwan")
              navigate('/taiwan')
            }}>Taiwan</Button>
          </div>
        </Grid>
      </Slide>
      <Slide direction="up" in={true} timeout={2000} mountOnEnter unmountOnExit>
        <Grid container sx={{
            backgroundImage: `url(${uk})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} xs={3} className="trip-page-column">
          <div className="trip-page-button">
            <Button variant="contained" disabled>UK</Button>
          </div>
        </Grid>
      </Slide>
      <Slide direction="down" in={true} timeout={2000} mountOnEnter unmountOnExit>
        <Grid container sx={{
            backgroundImage: `url(${hawaii})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} xs={3} className="trip-page-column">
          <div className="trip-page-button">
            <Button variant="contained" disabled onClick={() => {
              console.log("Clicked on Hawaii")
              navigate('/hawaii')
            }}>Hawaii</Button>
          </div>
        </Grid>
      </Slide>
      <Slide direction="up" in={true} timeout={2000} mountOnEnter unmountOnExit>
        <Grid container sx={{
            backgroundImage: `url(${singapore})`,
            backgroundSize: "cover",
            backgroundPosition: "center"
          }} xs={3} className="trip-page-column">
          <div className="trip-page-button">
            <Button variant="contained" disabled>Singapore/Thailand</Button>
          </div>
        </Grid>
      </Slide>
    </Grid>
  )
}