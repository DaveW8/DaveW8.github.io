import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap } from 'react-leaflet';
import TimelineSlider from './TimelineSlider';
import PointOfInterest from './PointOfInterest';
import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

var polyline = require('@mapbox/polyline');

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
		iconSize: [25,41], 
		iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const interpolatePoints = (points, ratio) => {
  if (points.length < 2) return points;

	const index = Math.floor(ratio)
	const nextIndex = index + 1;
	const startPoint = points[index];
	let endPoint = points[nextIndex];
	if (nextIndex >= points.length) {
		endPoint = points[index];
	}

	const lat = startPoint[0] + (endPoint[0] - startPoint[0]) * (ratio - index);
	const lng = startPoint[1] + (endPoint[1] - startPoint[1]) * (ratio - index);

	return points.slice(0, nextIndex).concat([[lat, lng]]);
};

// Restricts the map bounds and also logs coordinates
const MapBoundsRestrictor = ({bounds}) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
			map.setMaxBounds(bounds)

      const handleMoveEnd = () => {
				if (!bounds.contains(map.getCenter())) {
					map.setView(bounds.getCenter(), map.getZoom());
				}

				//const currentBounds = map.getBounds();
        //const southWest = currentBounds.getSouthWest();
        //const northEast = currentBounds.getNorthEast();

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
	const [currentPoi, setCurrentPoi] = useState({
		label: "Placeholder", 
		details: {
			description: "Placeholder"
		}
	});
	const [OSRMData, setOSRMData] = useState([]);

	const hasMounted = useRef(false);
	const route = routeData.map(point => point.position)
	const totalCoordinates = OSRMData.flat();

	// Calculate the index of the start of each segment and assign to locations
	const segmentStartIndexes = OSRMData.reduce((acc, segment, i) => {
		const prev = acc[i - 1] ?? 0;
		acc.push(i === 0 ? 0 : prev + OSRMData[i - 1].length);
		return acc;
	}, []);
	segmentStartIndexes.push(totalCoordinates.length - 1);
	routeData[routeData.length - 1].coordIndex = totalCoordinates.length - 1;

	routeData.map(location => {
		location.coordIndex = segmentStartIndexes[location.time]
	})

	// Build slider marks where they appear *evenly spaced* across the slider
	const locations = segmentStartIndexes.reduce((acc, coordIndex, i) => {
		acc[coordIndex] = {label: routeData.find(location => location.time === i).label, style: timelineStyles.markStyles}
		return acc;
	}, {});

	const handleSliderChange = (value) => {
		console.log("LOGGING CHANGE IN SLIDER VALUE", value)
  	setRatio(value);
  };

	// Fetch OSRM data on initial load only
	useEffect(() => {
		const fetchRoutes = async () => {
			const routeRequests = [];
			route.forEach((point, index) => {
				if (!(route.length - 1 === index)) {
					routeRequests.push(new Promise((resolve, reject) => {
						fetch(`https://router.project-osrm.org/route/v1/driving/${point[1]},${point[0]};${route[index + 1][1]},${route[index + 1][0]}?overview=full`)
							.then(response => response.json())
							.then(data => {
								resolve(polyline.decode(data.routes[0].geometry))
							})
					}))
				}
			})
			const routes = await Promise.all(routeRequests);
			setOSRMData(routes);
			console.log("LOGGING ALL ROUTES", routes)
		}

		fetchRoutes();
	}, []);

	// Recalculate polyline and markers on action
  useEffect(() => {
		if (hasMounted.current) {
			const updatedPoints = interpolatePoints(totalCoordinates, ratio);
			setPolylinePoints(updatedPoints);

			const updatedMarkers = routeData.filter(marker => marker.coordIndex <= ratio);
    	setVisibleMarkers(updatedMarkers);
		} else {
			hasMounted.current = true;
		}
  }, [ratio]);

	const openPoi = (markerPosition) => {
		setPoiIsOpen(true)
		const currentPoi = routeData.filter(poi => markerPosition === poi.position)
		setCurrentPoi(currentPoi[0]);
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
					<Polyline 
						positions={polylinePoints} 
						color="blue" 
					/>
				)}
				<Circle
					center={polylinePoints.length > 0 ? polylinePoints[polylinePoints.length - 1] : [0, 0]}
					radius={10}
					color="red"
					fillColor="red"
					fillOpacity={0.5}
				/>
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
			<TimelineSlider 
				disabled={OSRMData.length === 0} 
				onChange={handleSliderChange} 
				locations={locations} 
				styles={timelineStyles} 
				max={totalCoordinates.length - 1}
			/>
		</div>
  );
};

export default MapComponent;