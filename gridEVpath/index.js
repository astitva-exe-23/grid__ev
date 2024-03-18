const { sqrt } = require('mathjs')
const express = require('express');
var mysql = require('mysql');
const cors = require('cors');
const pathUtils = require('./pathfinder.js');

const app = express();
const port = 3000;
// calcRange
// calcDrain
app.use(express.json());
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));


let carBrand = '';
let carModel = '';
let carYear = '';
let chargeStd = '';
let maxRange = 0;
let maxCapacity = 0;
let chargingSpeed = 0;
let weight = 0;
let carVoltage = 0;
let motorVoltage = 0;
let carPower = 0 ;
let carEfficiency = 0;
let currentCharge=0;
let currentRange = 0;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mark42',
    database: 'gridev'
});

connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Query MySQL for user by username and password
    connection.query('SELECT * FROM user_data WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            console.error('Error querying MySQL:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        // If user not found or password doesn't match, return error
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // If authentication successful, set global variables
        const user = results[0];
        carBrand = user.brand;
        carModel = user.model;
        carYear = user.year;
        console.log(results[0])

        // Return success message and user data
        res.json({ message: 'Login successful', userId: user.id,brand: user.brand,model: user.model,year:user.year });
    });
});



app.post('/journeyStart', (req, res) => {
    const { startLocation, endLocation, chargePercentage } = req.body;

    // Call journeyStart with a callback function
    journeyStart(startLocation, endLocation, chargePercentage, (err, result) => {
        if (err) {
            // If there's an error, send an error response
            return res.status(500).json({ error: err });
        }

        // If no error, send the result as JSON response
        res.json(result);
    });
});

function journeyStart(startLoc, endLoc, chargePerc, callback) {
    connection.query('SELECT * FROM car_data WHERE car_data.model = ? AND car_data.brand = ? AND car_data.year = ?', [carModel, carBrand, carYear], (err, result, fields) => {
        if (err) {
            console.error(err); // Log the error
            callback(err); // Call the callback with an error
            return;
        }

        if (result.length > 0) { // Check if any results found
            const car = result[0];
            maxRange = car.range_ev; // Assuming max_range is the column for range
            maxCapacity = car.battery_capacity;
            chargingSpeed = car.charge_speed;
            weight = car.weight;
            carVoltage = car.voltage;
            motorVoltage = car.motor_voltage;
            carPower = car.power;
            carEfficiency = car.efficiency;
            chargeStd = car.charging_standard;

            currentRange = calcRange(chargePerc);
            pathThing = pathUtils.pathFindingAlgorithm(startLoc,endLoc,currentCharge,maxRange,chargeStd);


            const carData = {
                maxRange: car.range_ev,
                maxCapacity: car.battery_capacity,
                chargingSpeed: car.charge_speed,
                weight: car.weight,
                carVoltage: car.voltage,
                motorVoltage: car.motor_voltage,
                carPower: car.power,
                carEfficiency: car.efficiency,
                chargeStd: car.charging_standard,
                currentRange: currentRange,
                path: pathThing
            };
                                     // call 1st
            callback(null, carData); // Call the callback with the car data
        } else {
            console.log(`Car not found: ${carBrand} ${carModel} (${carYear})`);
            callback('Car not found'); // Call the callback with an error message
        }
    });
}


function calcRange(currentC)
{
    return currentC*maxRange/100.0;
}

app.post('/createAccount', (req, res) => {
    const { username, password, brand, model, year, mileage } = req.body;

    // Check if any required field is missing
    if (!username || !password || !brand || !model || !year || !mileage) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Construct SQL query to insert data into user_data table
    const sql = `INSERT INTO user_data (username, password, brand, model, year, mileage,correction_factor) VALUES (?, ?, ?, ?, ?, ?,?)`;
    const values = [username, password, brand, model, year, mileage,1];

    // Execute SQL query
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data into MySQL:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Data inserted successfully');
        res.status(200).json({ message: 'Data inserted successfully' });
    });
});

app.post('/dischargeUpdate', (req, res) => {
    const { currentLocation,chargePercentage,dischargeRate } = req.body;

    updateCharge(chargePercentage);
    pathThing = pathUtils.pathFindingAlgorithm(startLoc,endLoc,currentCharge,maxRange,chargeStd);




    res.json({ message: 'Car no go boom' ,pathThing});
});

function updateCharge(chrg)
{
    currentCharge=chrg;
}

// Journey end endpoint
app.post('/journeyEnd', (req, res) => {
    const { username,chargeDiff } = req.body;

    // Call the checkCharge function
    updateFactor(username,chargeDiff);

    // Send the difference back to the frontend
    res.json({ difference: difference });
});

// Function to check the charge difference
function updateFactor(chargeDiff)
{
    const sql = 'UPDATE user_data SET correction_factor = ? WHERE username = ?';

    // Execute the query
    connection.query(sql, [correctionFactor, username], (error, results, fields) => {
        if (error) {
            console.error('Error updating user correction factor:', error);
            return;
        }
        console.log('User correction factor updated successfully');
    });
}

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});

