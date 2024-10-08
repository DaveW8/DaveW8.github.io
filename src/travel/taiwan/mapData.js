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
		time: 0,
		details: {
			description: "The hotel where we stayed at on arriving in Taipei. We were there for 4 nights."
		}
	},
	{
		label: "Yehliu Geopark",
		position: [25.20644571375639, 121.69047652633472],
		time: 1, 
		details: {
			description: "A geopark we visited on Day 2 (first full day in Taipei). It's known for its rock formations caused by erosion."
		}
	},
	{
		label: "Jiufen Old Street",
		position: [25.109923970160335, 121.84518325631542],
		time: 2,
		details: {
			description: "A mountainside town said to have influenced the movie Spirited Away. The old street is a district known for narrow streets, food stalls and great views."
		}
	},
	{
		label: "Keelung Miaokou Night Market",
		position: [25.128468808652094, 121.74314760752218],
		time: 3,
		details: {
			description: "One of Taiwan's most well known night markets, fresh seafood is a specialty here in the port town of Keelung."
		}
	}
]

export { center, minZoom, bounds, routeData }