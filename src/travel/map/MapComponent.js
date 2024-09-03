import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import TimelineSlider from './TimelineSlider';
import PointOfInterest from './PointOfInterest';
import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
		iconSize: [25,41], 
		iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const interpolatePoints = (points, ratio) => {
  if (points.length < 2) return points;

  const index = Math.floor(ratio * (points.length - 1));
  const nextIndex = Math.min(index + 1, points.length - 1);
  const startPoint = points[index];
  const endPoint = points[nextIndex];

  const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * (ratio * (points.length - 1) - index);
  const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * (ratio * (points.length - 1) - index);

  //return points.slice(0, nextIndex + 1).concat([[lat, lng]]);
	return points.slice(0, nextIndex).concat([[lat, lng]]);
};

// Restrics the map bounds and also logs coordinates
const MapBoundsRestrictor = ({bounds}) => {
	//const bounds = boundsObject.bounds
  const map = useMap();

  useEffect(() => {
    if (map) {
			map.setMaxBounds(bounds)

      const handleMoveEnd = () => {
				if (!bounds.contains(map.getCenter())) {
					map.setView(bounds.getCenter(), map.getZoom());
				}

				const currentBounds = map.getBounds();
        const southWest = currentBounds.getSouthWest();
        const northEast = currentBounds.getNorthEast();

        //console.log("Southwest Corner:", southWest.lat, southWest.lng);
        //console.log("Northeast Corner:", northEast.lat, northEast.lng);
      };

      // Call initially to get the bounds when the map loads
      handleMoveEnd();

      // Add event listener to update bounds on moveend
      map.on('moveend', handleMoveEnd);

      // Clean up event listener on component unmount
      return () => {
        map.off('moveend', handleMoveEnd);
      };
    }
  }, [map]); // Add map as a dependency to ensure useEffect runs when map is ready

  return null; // This component does not need to render anything
};

//const MapComponent = ({center, minZoom, bounds, route, locations, routeData }) => {
const MapComponent = ({center, minZoom, bounds, routeData, timelineStyles }) => {
	const [polylinePoints, setPolylinePoints] = useState([]);
	const [ratio, setRatio] = useState(0);
	const [visibleMarkers, setVisibleMarkers] = useState([]);
	const [poiIsOpen, setPoiIsOpen] = useState(false);
	const [currentPoi, setCurrentPoi] = useState({label: "Placeholder", details: {description: "Placeholder"}});

	const hasMounted = useRef(false);

	const route = routeData.map(point => point.position)
	const locations = routeData.map(point => ({label: point.label, style: timelineStyles.markStyles}))

	const handleSliderChange = (value) => {
		//console.log("LOGGING CHANGE IN SLIDER VALUE", value)
    setRatio(value);
  };

  useEffect(() => {
		if (hasMounted.current) {
			//console.log("LOGGING POINTS BEFORE UPDATE", polylinePoints)
			const updatedPoints = interpolatePoints(route, ratio);
			//console.log("LOGGING POINTS AFTER UPDATE", updatedPoints)
			setPolylinePoints(updatedPoints);

			const updatedMarkers = routeData.filter(marker => marker.time <= ratio);
    	setVisibleMarkers(updatedMarkers);
		} else {
			hasMounted.current = true;
		}
  }, [ratio]);

	const openPoi = (markerPosition) => {
		setPoiIsOpen(true)
		//console.log("LOGGING MARKER POSITION", markerPosition)
		const currentPoi = routeData.filter(poi => markerPosition === poi.position)
		setCurrentPoi(currentPoi[0])
	};
  const closePoi = () => setPoiIsOpen(false);

  return (
		<div 
			style={{ 
				height: '100vh',
				margin: '0',
				overflow: 'hidden',
				position: 'relative'
				//width: '100%'
			}}
		>
			<MapContainer 
				center={center} 
				zoom={minZoom} 
				minZoom={minZoom} 
				bounds={bounds}
				timelineStyles={timelineStyles}
				style={{ 
					height: '100%', 
					width: '100%' 
				}}
			>
				<TileLayer
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				/>
				{polylinePoints.length > 0 && (
					<Polyline positions={polylinePoints} color="blue" />
				)}
				{visibleMarkers.map((marker, index) => (
					<Marker key={index} position={marker.position} eventHandlers={{ click: () => {openPoi(marker.position)} }}>
						<Popup>{marker.label}</Popup>
					</Marker>
				))}
				<MapBoundsRestrictor bounds={bounds} />
				<PointOfInterest
					open={poiIsOpen}
					onClose={closePoi}
					data={currentPoi}
				/>
			</MapContainer>
			<TimelineSlider onChange={handleSliderChange} locations={locations} styles={timelineStyles} />
		</div>
  );
};

export default MapComponent;