const { Client, Status } = require('@googlemaps/google-maps-services-js');
const axios = require('axios');

const googleAPIkey = "AIzaSyBuWO5VJoAJdriMblQCCzX4TN79n7pcmYM"; // Re

async function sendRequest(origin, destination, waypoint) {
    // Initialize a new Client instance

    const client = axios.create({
        baseURL: 'https://maps.googleapis.com/maps/api/directions/json',
        params: {
            key: googleAPIkey
        }
    });//
    // Define your request parameters
    const params = {
        origin: origin.join(','), // Convert array to string
        destination: destination.join(','), // Convert array to string
        mode: 'driving', // You can change this to other travel modes (e.g., 'bicycling', 'transit')
    };

    // Add waypoint to params only if it's not empty
    if (waypoint && waypoint.length > 0) {
        params.waypoints = [waypoint.join(',')]; // Convert array to string
    }

    try {
        // Send a directions request
        const response = await client.get('', { params });

        // Handle successful response

        console.log("Directions:", response.data);
        return response.data;
    } catch (error) {
        // Handle error
        console.error("Error fetching directions:", error.message);
        return { error: "Failed to retrieve directions" }; // Example error response
    }
}

// Function to generate a unique ID for each station (example using index)
function generateStationId(station) {
    // Assuming filterStationsByStandard is called with stations array
    return stations.indexOf(station); // Use station index as a simple ID
}


function filterStationsByStandard(stations, chargingStandard) {
    const filteredStations = {};

    // Loop through each station
    for (let i = 0; i < stations.length; i++) {
        const stationStandard = station[i].ChargingStandard;

        // Check if station standard matches user input (case-insensitive)
        if (stationStandard.toLowerCase() === chargingStandard.toLowerCase()) {
            const stationId = generateStationId(station); // Replace with your logic to create a unique ID

            // Add station details to the filteredStations dictionary with the generated ID as the key
            filteredStations[stationId] = {
                latitude: station.Latitude,
                longitude: station.Longitude,
                distanceFromHighway: station["Distance from Highway(km)"],
                capacity: station["Capacity(kW)"],
                // ... add other properties if needed
            };
        }
    }

    return filteredStations;
}
async function simplifyRouteGeometry(route) {
    const overviewPath = [];
    const legs = route.legs;

    for (const leg of legs) {
        const steps = leg.steps;
        for (const step of steps) {
            // Use Google Maps API client library to get detailed step information
            const startLocation = step.start_location;
            overviewPath.push([startLocation.lat, startLocation.lng]); // Add start location of each step
        }
    }

    return overviewPath;
}

async function sendRequestOverviewPath(origin, response) {
    // ... existing logic to fetch directions ...

    const route = response.routes[0]; // Assuming the first route is relevant
    const simplifiedOverviewPath = await simplifyRouteGeometry(route);

    // Use the simplifiedOverviewPath for further calculations
    return filterStationsInCircle(stations, simplifiedOverviewPath, origin[0], origin[1]);

}


function filterStationsInCircle(stations, overviewPath, userLatitude, userLongitude) {
    const filteredStations = {};

    // Calculate the midpoint of the overview path
    const midpoint = calculateMidpoint(overviewPath);

    // Calculate the radius (half the distance from user to response)
    const radius = calculateDistance(userLatitude, userLongitude, midpoint.latitude, midpoint.longitude) / 2;

    // Loop through each station
    for (const station of stations) {
        const stationLatitude = station.Latitude;
        const stationLongitude = station.Longitude;

        // Check if station is within the circle
        if (isInsideCircle(stationLatitude, stationLongitude, midpoint.latitude, midpoint.longitude, radius)) {
            const stationId = generateStationId(station); // Replace with your logic to create a unique ID

            // Add station details to the filteredStations dictionary with the generated ID as the key
            filteredStations[stationId] = {
                latitude: station.Latitude,
                longitude: station.Longitude,
                distanceFromHighway: station["Distance from Highway(km)"],
                capacity: station["Capacity(kW)"],
                // ... add other properties if needed
            };
        }
    }

    return filteredStations;
}

// Function to calculate midpoint of a path (replace with your actual path data handling)
function calculateMidpoint(overviewPath) {
    // Implement logic to calculate the midpoint coordinates based on your overview path data structure
    // This example assumes overviewPath is an array of latitude/longitude pairs
    const totalPoints = overviewPath.length;
    const midPointIndex = Math.floor(totalPoints / 2);
    return {
        latitude: overviewPath[midPointIndex][0],
        longitude: overviewPath[midPointIndex][1]
    };
}

// Function to calculate distance between two points (replace if needed)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Function to convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

// Function to check if a point is inside a circle (replace if needed)
function isInsideCircle(pointLatitude, pointLongitude, circleCenterLatitude, circleCenterLongitude, radius) {
    const distanceFromCenter = calculateDistance(pointLatitude, pointLongitude, circleCenterLatitude, circleCenterLongitude);
    return distanceFromCenter <= radius;
}

// Function to generate a unique ID for each station (example using index)

function SortStations(filteredStations) {

    // Sort the filtered stations by capacity/distance ratio
    const sortedStations = Object.values(filteredStations).sort((station1, station2) => {
        const capacityRatio1 = station1.capacity / station1["Distance from Highway(km)"];
        const capacityRatio2 = station2.capacity / station2["Distance from Highway(km)"];
        return capacityRatio1 - capacityRatio2;
    });

    return sortedStations;
}

// ... other functions from previous explanations (filterStationsInCircle, etc.)


function findOptimalStation(chargeStandard, origin, response, currentRange) {
    const filteredByProximity = sendRequestOverviewPath(origin, response);
    const filteredByChargingStandard = filterStationsByStandard(filteredByProximity, chargeStandard);
    const sortedStations = SortStations(filteredByChargingStandard);
    const travellableRange = 0.7 * currentRange;

    for (let i = 0; i < sortedStations.length; i++) { // Iterate through sorted stations
        const firstStation = sortedStations[i];
        const lat = firstStation.latitude;
        const lng = firstStation.longitude;

        // Calculate distance from origin (assuming you have a function to do this)
        const distanceToStation = calculateDistance(origin[0], origin[1], lat, lng);

        if (distanceToStation <= travellableRange) {
            return [lat, lng]; // Return station coordinates if within range
        }
    }

    return null; // No station found within range
}
function sendPath (respone)
{
    return respone;
}

function pathFindingAlgorithm(origin, destination, currentCharge, maxRange, chargeStandard) {
    const response = sendRequest(origin, destination, []);
    const currentRange = currentCharge * maxRange / 100;

    // Check if the response object and its properties are defined
    if (response && response.routes && response.routes.length > 0 && response.routes[0].legs && response.routes[0].legs.length > 0) {
        const distance = response.routes[0].legs[0].distance.value; // Access the distance value
        if (currentRange < distance) { // Check if current range is enough
            const optimalStation = findOptimalStation(chargeStandard, origin, response, currentRange);
            if (optimalStation) { // If optimal station found
                // Update route with station
                const response = sendRequest(origin, destination, optimalStation);
            } else {
                console.error("No suitable charging station found within range.");
                // Handle case where no station is found
            }
        }
    } else {
        console.error("Error: Invalid or incomplete response from the Directions API.");
        // Handle the case where the response is invalid or incomplete
    }

    // Process or return the final response (replace with your logic)
    return response;
}


module.exports = {
    filterStationsInCircle,
    calculateMidpoint,
    calculateDistance,
    degreesToRadians,
    isInsideCircle,
    generateStationId,
    SortStations,
    findOptimalStation,
    sendPath,
    pathFindingAlgorithm
};