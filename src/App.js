import './App.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import taiwan from "./images/Taiwan.jpg";
import uk from "./images/UK.jpg";
import hawaii from "./images/Hawaii.jpg";
import singapore from "./images/Singapore.jpg";

function App() {
  return (
    <div className="App">
      <Grid container columns={4}>
        <Slide direction="down" in={true} timeout={2000} mountOnEnter unmountOnExit>
          <Grid container sx={{
              backgroundImage: `url(${taiwan})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }} xs={3} className="trip-page-column">
            <div className="trip-page-button">
              <Button variant="contained">Taiwan</Button>
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
              <Button variant="contained">UK</Button>
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
              <Button variant="contained">Hawaii</Button>
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
              <Button variant="contained">Singapore/Thailand</Button>
            </div>
          </Grid>
        </Slide>
      </Grid>
    </div>
  );
}

export default App;
