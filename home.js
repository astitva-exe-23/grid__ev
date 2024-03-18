let map;
let autocompleteService;
let placeService;
var dlat=0;
var lan=0, lon=0;
var dlon=0;

function initMap() {
    const initialLocation = { lat: 12.9805838, lng: 79.1661297};
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
    document.getElementById("dest").value = prediction.description;
    document.getElementById("location-dropdown").style.display = "none";

    placeService.getDetails({ placeId: prediction.place_id }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            map.setCenter(place.geometry.location);
            new google.maps.Marker({
                map,
                position: place.geometry.location,
            });
            dlat = place.geometry.location.lat();
            dlon = place.geometry.location.lng();
            console.log(place.geometry.location.lat(),place.geometry.location.lng());
            // Make an API call to 'journeyStart'
            
}})
}

document.getElementById('vehicleInfo').addEventListener('click',()=>{
    render();
})

function render()
{
    if(visited == false)
    {
        visited = true;
        document.getElementById('vehicleInfo').innerHTML=`
    <div style="align-items:center; width:100%">
        Porsche Taycan 4S
    </div>
    <div class="details">
        <div class="d1">
            <div class="d2">Year<br>2004</div>
            <div class="d2">Mileage<br>1000kWh</div>
        </div>
        <div class="d1">
            <div class="d2">HorsePower<br>300HP</div>
            <div class="d2">Range<br>200km</div>
        </div>
    </div>`;
    document.getElementById('vehicleInfo').style.padding='10px';
    document.getElementById('vehicleInfo').style.display='flex';
    document.getElementById('vehicleInfo').style.flexDirection='column';
    document.getElementById('vehicleInfo').style.width='90vw';
    document.getElementById('vehicleInfo').style.height='20vh';
    document.getElementById('vehicleInfo').style.fontSize='larger';
    document.getElementById('vehicleInfo').style.textAlign='center';
    }
    else
    {
        visited=false;
        document.getElementById('vehicleInfo').innerHTML=`<img src="GridEV/ion_car-sport-sharp.png">`;
        document.getElementById('vehicleInfo').style.padding='';
        document.getElementById('vehicleInfo').style.display='';
        document.getElementById('vehicleInfo').style.flexDirection='';
        document.getElementById('vehicleInfo').style.width='';
        document.getElementById('vehicleInfo').style.height='';
        document.getElementById('vehicleInfo').style.fontSize='';
        document.getElementById('vehicleInfo').style.textAlign='';
    }
    
    
}

document.getElementById("form").addEventListener('submit', (event)=>{ a(event) });

function a(event)
{
    event.preventDefault(); // Prevent form submission
    
    const dest = document.getElementById("dest").value;
    const bp = document.getElementById("batp").value;
    
    if (bp < 20) {
        alert("Please charge your car before going");
        return; // Stop further execution
    }
    var resp;
    const success = (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        var data = {
            startLat: 20.698147074333,//lat
            startLon:  77.004407926244,//lon
            endLat: 19.0542898564310,//dlat
            endLon: 72.84540732866,//dlon // Assuming you have 'dlat' and 'dlon' defined somewhere
            chargePercentage: bp
        };
        console.log(data);
        fetch('http://192.168.238.204:3000/journeyStart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.error) {
                alert(responseData.error);
            } else {
                console.log(responseData);
                resp = responseData;
                localStorage.setItem("response", JSON.stringify(responseData)); // Store the response as JSON string
                var map = new google.maps.Map(document.getElementById('map'), {
                    zoom: 10, // Set the initial zoom level
                    center: {lat: 40.7128, lng: -74.0060} // Set the initial center to New York City
                });
                resp.forEach(function(point) {
                    var marker = new google.maps.Marker({
                        position: point,
                        map: map
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    const error = (err) => {
        console.log("Error:", err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10, // Set the initial zoom level
        center: {lat: 20.698147074333, lng: 77.004407926244} // Set the initial center to New York City
    });
    response.forEach(function(point) {
        var marker = new google.maps.Marker({
            position: point,
            map: map
        });
    });

}
