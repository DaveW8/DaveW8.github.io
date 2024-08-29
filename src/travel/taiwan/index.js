import MapComponent from "../map/MapComponent";
import { center, minZoom, bounds, routeData } from "./mapData"

const timelineStyles = {
  markStyles: {
    color: '#333', 
    fontSize: '20px', 
    fontWeight: 'bold', 
    padding: '5px', 
    background: '#f5f5f5', 
    borderRadius: '3px', 
    border: '1px solid #ccc' 
  }
};

export default function Taiwan() {
  return (
    <div>
      <MapComponent 
        center={center} 
        minZoom={minZoom} 
        bounds={bounds} 
        routeData={routeData}
        timelineStyles={timelineStyles}
      />
    </div>
  )
}