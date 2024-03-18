var avgacc=0;
var tacc=0;
var u=0;
var v=0;
var n = 1;
var current=0;
var dischargeR = 0;
var lat=0;
var lon=0;

let map;
let autocompleteService;
let placeService;

var visited=false;

function initMap() {
    const initialLocation = { lat: 19.10385934168722, lng: 72.88770719612143}; // Default location
    map = new google.maps.Map(document.getElementById("map"), {
        center: initialLocation,
        zoom: 16,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
    });

    autocompleteService = new google.maps.places.AutocompleteService();
    placeService = new google.maps.places.PlacesService(map);

    document.getElementById("dest").addEventListener("input", function() {
        const input = document.getElementById("dest").value;
        autocompleteService.getPlacePredictions({ input: input }, function(predictions, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                displaySuggestions(predictions);
            }
        });
    });
}

function displaySuggestions(predictions) {
    const dropdown = document.getElementById("location-dropdown");
    dropdown.innerHTML = "";
    dropdown.style.display = "block";

    predictions.forEach(function(prediction) {
        const div = document.createElement("div");
        div.textContent = prediction.description;
        div.addEventListener("click", function() {
            selectLocation(prediction);
        });
        dropdown.appendChild(div);
    });

}

function selectLocation(prediction) {
    document.getElementById("location-input").value = prediction.description;
    document.getElementById("location-dropdown").style.display = "none";

    placeService.getDetails({ placeId: prediction.place_id }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(place.geometry.location);
            new google.maps.Marker({
                map,
                position: place.geometry.location,
            });

            // Make an API call to 'journeyStart'
            fetch('http://192.168.238.204:3000/journeyStart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ location: place.geometry.location }),
            })
                .then(response => response.json())
                .then(data => console.log('Success:', data))
                .catch((error) => console.error('Error:', error));
        }
    });
}


document.querySelector(".charge").addEventListener('click', () => {
    remove();
})

function remove()
{
    document.querySelector('.charging').innerHTML=`<img src="../GridEV/clarity_battery-solid.png"> Charging`;
    document.querySelector('.charge').remove();
    document.querySelector('.eta').innerHTML=`ETA to Destination<br>2hr 30mins`;
    document.getElementById('resume').innerHTML='Resume<br>Journey';
}

document.querySelector('.end').addEventListener('click',()=>{
    document.body.innerHTML=`
    <input type="text" id="bp" placeholder="Your current Battery Percentage">`;

})


if (window.DeviceMotionEvent != undefined) {
 window.ondevicemotion = function(e) {
  var x = event.acceleration.x;
  var y = event.acceleration.y;
  var z = event.acceleration.z;
  tacc=Math.sqrt(x*x + y*y + z*z);
        
 }
}
setTimeout(() => {
    avgacc + tacc;
    n=n+1;
    if(n==10)
    {
        var acc = avgacc/10;
        v = u + acc * 10;
        
    }
  },1000);

setTimeout(() => {
    var acc = avgacc/10;
    v = u + acc * 10;
    var mV = localStorage.getItem("motorVoltage");
    var bV = localStorage.getItem("batteryVoltage");
    var P =  localStorage.getItem("power");
    var w =  localStorage.getItem("weight");
    var e =  localStorage.getItem("effiiciency");
    var t = localStorage.getItem("time");

    if(tacc>0.5)
    {
        current = dischargeRate(x,y,z,v,u,w,e,t);
    }

    dischargeR += current;

  },10000);
  

setTimeout(() => {

    var charge = localStorage.getItem("currentpercentage"); 
    navigator.geolocation.getCurrentPosition(success,error);
    const success = (position) => {
        console. log(position)
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        console.log(latitude);
        console.log(longitude);
        
        }
    const error = () => { console.log("Error"); }        
    const data = {
        location:[lat,lon],
        chargep: (charge-dischargeR),
        dischargeR:dischargeR

    }
    fetch('http://192.168.238.204:3000/dischargeUpdate', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
  })
  
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      //  return response.json();
  })
  .then(data => {
      console.log('API Response:', data);
      // Optionally, you can handle the response here
  })
  .catch(error => {
      console.error('There was a problem with the API request:', error);
  });
},300000)



function dischargeRate(accelX,accelY,accelZ,motorVoltage,batteryVoltage,power,velocityCurrent,velocityPast,weight,efficiency,time)
{
    
    // let estVel = 100; //velocity assumed to be 100km/h
    // let distancePerkWh = 1000/efficiency;   // km covered after consuming 1kwh
    // let timeTakenPerkWh = distancePerkWh/100; // TIME IN HOURS
    // timeTakenPerkWh = timeTakenPerkWh*3600; // convert to seconds
    // let powerCalculations = 1000/timeTakenPerkWh; // How many Wh consumed persecond
    // let wattSeconds = powerCalculations*3600; // Power in WattSeconds
    // let cruiseCurrent = wattSeconds/motorVoltage;
    // console.log(cruiseCurrent);


   // console.log("amps drawn via mom "+ampMom);

    let air_density = 1.2
    let rolling_resistance_coefficient = 0.015


    let total_acceleration = Math.sqrt(accelX*accelX + accelY*accelY + accelZ*accelZ);
    console.log("Accel:"+total_acceleration)
    let drag_force = 0.5 * air_density * rolling_resistance_coefficient * velocityCurrent*velocityCurrent*2.2;
    console.log("Drag:"+drag_force)
    let total_force = total_acceleration * weight + drag_force;
    console.log("Total Force:"+total_force);


    let dist = (velocityCurrent*velocityCurrent-velocityPast*velocityPast)/(2*total_acceleration);
    let keDiff = 0.5*weight*((velocityCurrent*velocityCurrent)-(velocityPast*velocityPast));
    let pwr = keDiff/time;
    let current = pwr/motorVoltage;
    console.log("Current "+current)
    //let discharge_rate = (ws/motorVoltage)+ampMom;
    return current;

}

