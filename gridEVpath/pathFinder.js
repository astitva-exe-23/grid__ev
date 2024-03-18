import { stations } from "./stations";

const googleAPIkey = "AIzaSyBuWO5VJoAJdriMblQCCzX4TN79n7pcmYM";
(g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__",
        m = document, b = window;
  
    b[c] = b[c] || {}; // Create a namespace for Google Maps if it doesn't exist
    b.maps = b.maps || {}; // Create the maps object within the Google namespace
  
    const e = new URLSearchParams(); // URL search parameters for API request
  
    function u() { // Async function to load the API
      if (h) {
        return h; // If already loading or loaded, return the promise
      }
  
      h = new Promise(async (f, n) => {
        a = m.createElement("script");
  
        e.set("key", googleAPIkey); // Replace with your API key
        // Optional parameters: v (version), callback, etc.
  
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        b[c].maps[q] = f; // Assign the callback function
  
        a.onerror = () => h = n(Error(p + " could not load.")); // Handle errors
        a.nonce = m.querySelector("script[nonce]")?.nonce || ""; // Set nonce if present
  
        m.head.append(a);
      });
  
      return h;
    }
  
  })(g => {
    // This function will be called when the API is loaded
    console.log("Google Maps API loaded!");
  
    // Use the loaded API for your backend requests here
    // (e.g., geocoding, directions, etc.)
  });
  

async function sendRequest(origin, destination, waypoint) {
const originCoords = { lat: origin[0], lng: origin[1] };
const destinationCoords = { lat: destination[0], lng: destination[1] };

const directionsService = new google.maps.DirectionsService();

// Check if waypoint is provided, handle both cases
if (waypoint) {
    const waypointCoords = { lat: waypoint[0], lng: waypoint[1] };
    const request = {
    origin: originCoords,
    destination: destinationCoords,
    waypoints: [{ location: waypointCoords }],
    travelMode: 'driving' // You can change this to other travel modes (e.g., 'bicycling', 'transit')
    };

    try {
    const response = await directionsService.route(request);
    // Handle successful response (e.g., return directions data or log success)
    console.log("Directions with waypoint:", response);
    return response; // You can modify this to return specific data from the response
    } catch (error) {
    console.error("Error fetching directions with waypoint:", error);
    // Handle errors appropriately (e.g., return an error message or code)
    return { error: "Failed to retrieve directions" }; // Example error response
    }
} else {
    // Handle request without waypoint
    const request = {
    origin: originCoords,
    destination: destinationCoords,
    travelMode: 'driving' // You can change this to other travel modes (e.g., 'bicycling', 'transit')
    };

    try {
    const response = await directionsService.route(request);
    // Handle successful response
    console.log("Directions without waypoint:", response);
    return response; // You can modify this to return specific data from the response
    } catch (error) {
    console.error("Error fetching directions:", error);
    // Handle errors appropriately
    return { error: "Failed to retrieve directions" }; // Example error response
    }
}
}

// Function to generate a unique ID for each station (example using index)
function generateStationId(station) {
    const stations = [...arguments]; // Assuming filterStationsByStandard is called with stations array
    return stations.indexOf(station); // Use station index as a simple ID
}

function filterStationsByStandard(stations, chargingStandard) {
    const filteredStations = {};
  
    // Loop through each station
    for (const station of stations) {
      const stationStandard = station["ChargingStandard"];
  
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
  function simplifyRouteGeometry(route) {
    const overviewPath = [];
    const legs = route.legs;
  
    for (const leg of legs) {
      const steps = leg.steps;
      for (const step of steps) {
        const encodedPolyline = step.polyline.points;
        // Use a polyline simplification library to reduce the number of points (optional)
        // overviewPath.push(...decodePolyline(encodedPolyline)); // Example using decodePolyline function
        overviewPath.push([step.start_location.lat(), step.start_location.lng()]); // Add start location of each step
      }
    }
  
    return overviewPath;
  }
  
  async function sendRequestOverviewPath(origin, response) {
    // ... existing logic to fetch directions ...
  
    const route = response.routes[0]; // Assuming the first route is relevant
    const simplifiedOverviewPath = simplifyRouteGeometry(route);
  
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
  function generateStationId(station) {
    const stations = [...arguments]; // Assuming filterStationsByStandard is called with stations array
    return stations.indexOf(station); // Use station index as a simple ID
  }
  
  function SortStations(stations) {
  
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
    const filtererdByProximity = sendRequestOverviewPath(origin, response);
    const filteredByChargingStandard = filterStationsByStandard(filtererdByProximity, chargeStandard);
    const sortedStations = SortStations(filteredByChargingStandard);
    const travellableRange = 0.7*currentRange;
    for(var i = 0; i < sortedStations.length(); i++)
    {
        const firstStation = sortedStations[i];
        var lat = firstStation.latitude;
        var lng = firstStation.longitude;
        var min = [lat, lng];
        if(Math.sqrt(Math.pow(lat-origin[0], 2)+Math.pow(lat-origin[0], 2))<=travellableRange)
        {
            var loc = [lat, lng];
            break;
        }    
    }
    
    return loc;
}
function sendPath (respone)
{
    return respone;
}
function pathFindingAlgorithm (origin, destination, currentCharge, maxRange, chargeStandard)
{

    var response = sendRequest(origin, destination, []);
    const currentRange = currentCharge*maxRange/100;
    var optimalStation = [];
    if(currentRange<distance)
    {
        optimalStation = findOptimalStation(chargeStandard, origin, response, currentRange);
        response = sendRequest(origin, destination, optimalStation)
    }
    else
    {
        var newRange = currentRange - 0.3*maxRange;
        if(newRange<distance)
        {
            optimalStation = findOptimalStation();
            response = sendRequest(origin, destination, optimalStation)
        }
        else
        {
            sendPath(response);
        }

    }
}