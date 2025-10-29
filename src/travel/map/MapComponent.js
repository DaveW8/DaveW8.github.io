import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle, useMap, useMapEvent } from 'react-leaflet';
import Select from 'react-select';
import TimelineSlider from './TimelineSlider';
import PointOfInterest from './PointOfInterest';
import HomeButton from './HomeButton';
import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
//var polyline = require('@mapbox/polyline');

const EPSILON = 1e-6;
const MIN_SLIDER = 0;
const MAX_SLIDER = 100;
// IF this is selected, will use the entire route
const DEFAULT_DAY = {
	value: 0, 
	label: "Day 0"	
};

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
		iconSize: [25,41], 
		iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const selectStyles = {
	container: (base) => ({
		...base,
		position: 'absolute',
		zIndex: 1000,
		bottom: '150px',
		left: '50px',
		fontSize: '20px', 
 		fontWeight: 'bold'
	})
}

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

// Tracks the zoom level
const ZoomTracker = ({ onZoomChange }) => {
  useMapEvent("zoomend", (event) => {
    const newZoom = event.target.getZoom();
		console.log("LOGGING ZOOM LEVEL", newZoom)
    onZoomChange(newZoom);
  });
  return null; // this component only attaches the event listener
}

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
	const [dayIndex, setDayIndex] = useState(0);
	const [zoom, setZoom] = useState(9);

	const hasMounted = useRef(false);

	const getFullRoute = () => {
		return routeData.map(day => 
			day.index === routeData.length ? day.locations : day.locations.slice(0, -1)
		).flat();
	}

	const getStepSize = () => {
		return (MAX_SLIDER - MIN_SLIDER) / (OSRMData.length - 1)
	}

	const buildLocations = (dayIndex) => {
		let markStyle = timelineStyles.markStyles;
		const locations = OSRMData.reduce((acc, loc, index) => {
			const key = MIN_SLIDER + index * getStepSize();
			if (key === 0) {
				markStyle = { ...markStyle, transform: 'translateX(0%)' }
			} else if (key === 100) {
				markStyle = { ...markStyle, transform: 'translateX(-100%)', whiteSpace: 'nowrap' }
			} else {
				markStyle = timelineStyles.markStyles;
			}
			acc[key] = {label: OSRMData[index].label, style: dayIndex === 0 ? {display: "none"} : markStyle};
			return acc;
		}, {})
		
		return locations;
	};

	const handleSliderChange = (value) => {
  	setRatio(value);
  };

	const handleDayChange = (value) => {
		const dayIndex = value.value
		setDayIndex(dayIndex);
	}

	// Fetch OSRM data on initial load only (Needs updating to fit new data format)
	useEffect(() => {
		// Not fetching routes at the moment due to rate limiting
		/*
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
		*/

		// Use predownloaded routes for now
		setOSRMData(getFullRoute());
	}, []);

	// Clear map and set timeline slider to matching day when the day is changed
	useEffect(() => {
		const data = dayIndex === 0 
			? getFullRoute()
			: routeData.find(day => day.index === dayIndex).locations;
		setOSRMData(data);
		setVisibleMarkers([]);
		setPolylinePoints([]);
		setRatio([0]);
	}, [dayIndex]);

	// Recalculate polyline and markers when the timeline slider is moved
  useEffect(() => {
		if (hasMounted.current) {
			const interpolationResult = interpolatePoints(ratio);
			const updatedPoints = interpolationResult.points;
			setPolylinePoints(updatedPoints);

			const segmentIndex = interpolationResult.segmentIndex
			const updatedMarkers = OSRMData.slice(0, segmentIndex + 1);
    	setVisibleMarkers(updatedMarkers);
		} else {
			hasMounted.current = true;
		}
  }, [ratio]);

	const openPoi = (markerPosition) => {
		setPoiIsOpen(true)
		const currentPoi = OSRMData.filter(poi => markerPosition === poi.position);
		setCurrentPoi(currentPoi[0]);
	};
  const closePoi = () => setPoiIsOpen(false);

	const interpolatePoints = (ratio) => {
		const segments = OSRMData.slice(0, -1).map(location => location.route);
		const stepSize = getStepSize(dayIndex);
		const segmentIndex = Math.floor(ratio / stepSize);
		let segmentProgress = (ratio % stepSize) / stepSize;
		// Cap to valid range
		const safeSegmentIndex = Math.min(segmentIndex, segments.length - 1);

		if (ratio >= MAX_SLIDER) {
			return { points: segments.flat(), segmentIndex };
		}

		if (isOnMark(ratio)) {
			segmentProgress = 0;
		}

		let partial = [];

		// Add all previous full segments
		for (let i = 0; i < safeSegmentIndex; i++) {
			partial = partial.concat(segments[i]);
		}

		// Add partial current segment
		const currentSegment = segments[safeSegmentIndex];
		const coordIndex = Math.floor(segmentProgress * currentSegment.length);

		partial = partial.concat(currentSegment.slice(0, coordIndex + 1));

		return { points: partial, segmentIndex }
	};

	// Smoothing to set the slider progress to 0 if it's too close to being on the mark but isn't
	const isOnMark = (sliderValue) => {
		const stepSize = getStepSize();
		return Math.abs((sliderValue % stepSize)) < EPSILON || 
			Math.abs((sliderValue % stepSize) - stepSize) < EPSILON;
	}

  return (
		<div 
			style={{ 
				height: '100vh',
				margin: '0',
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
					radius={100 * Math.pow(2, 13 - zoom)}
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
				<ZoomTracker onZoomChange={setZoom} />
				<PointOfInterest
					open={poiIsOpen}
					onClose={closePoi}
					data={currentPoi}
				/>
			</MapContainer>
			<HomeButton />
			<Select
				defaultValue={DEFAULT_DAY}
				options={[
					DEFAULT_DAY, 
					...routeData.map(day => {
						return { value: day.index, label: day.title}
					})
				]}
				onChange={handleDayChange}
				styles={selectStyles}
				menuPlacement="top"
			/>
			<TimelineSlider
				ratio={ratio} 
				disabled={OSRMData.length === 0} 
				onChange={handleSliderChange} 
				locations={buildLocations(dayIndex)}
				styles={timelineStyles} 
				max={MAX_SLIDER}
			/>
		</div>
  );
};

export default MapComponent;