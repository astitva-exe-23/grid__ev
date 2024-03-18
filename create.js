// create.js

// Function to store username and password
function storeCredentials() {
    var username = document.getElementById("uname").value;
    var password = document.getElementById("pass").value;
    
    // Example: Storing in local storage
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
}

// Adding an event listener to the form submission
document.getElementById("form").addEventListener("submit", function(event) {
    // Preventing the default form submission behavior
    event.preventDefault();
    
    // Storing credentials
    storeCredentials();
    
    // Navigating to add_vehicle.html
    window.location.href = "add_vehicle.html";
});
