


document.querySelector(".forgot").addEventListener('click',() =>{
  forgot();
})

function forgot()
{
  
}


document.getElementById("form").addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById("name");
    const pass = document.getElementById("pass");
    var data = {
      username: name.value,
      password: pass.value
  };
    fetch('http://192.168.238.204:3000/login', { //backend API runs on http://localhost:3000
    method: 'POST',
    headers: {
    'Content-Type': 'application/json'
},
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(data => {
    if (data.error) {
    // If there's an error, display it
    alert(data.error);
} else {
    console.log('User ID:', data.userId);
    console.log('Car Brand:', data.brand);
    console.log('Car Model:', data.model);
    console.log('Car Year:', data.year);
    alert(data.message);
    window.location.href = "home.html";
    // Redirect to dashboard or another page upon successful login
    // window.location.href = '/dashboard.html';
}
})
    .catch(error => {
    console.error('Error:', error);
});
})