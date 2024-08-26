import L from 'leaflet';

const center = [23.5, 121.0];

const minZoom = 9;

const bounds = L.latLngBounds(
	L.latLng(21.621686075971915, 118.49304199218751), // Southwest coordinates
	L.latLng(25.351472502592568, 123.50555419921876)  // Northeast coordinates
);

const routeData = [
	{
		label: "Miramar Garden Taipei",
		position: [25.045069908629372, 121.53724383624217],
		time: 0
	},
	{
		label: "Yehliu Geopark",
		position: [25.20644571375639, 121.69047652633472],
		time: 1
	}
]

export { center, minZoom, bounds, routeData }