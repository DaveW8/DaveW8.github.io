import MapComponent from "../map/MapComponent";
import { center, minZoom, bounds, routeData } from "./mapData"

export default function Taiwan() {
  return (
    <div>
      <MapComponent 
        center={center} 
        minZoom={minZoom} 
        bounds={bounds} 
        routeData={routeData} 
      />
    </div>
  )
}