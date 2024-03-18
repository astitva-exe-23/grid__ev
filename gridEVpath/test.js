var mysql = require('mysql');
const express = require('express');

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mark42",
    database: "gridev"
});

let carBrand = 'BMW';
let carModel = 'iX3';
let carYear = 2021;

let weight = 0;

connection.query('SELECT * FROM car_data WHERE car_data.model = ? AND car_data.brand = ? AND car_data.year = ?', [carModel, carBrand, carYear], (err, result, fields) => {
    if (err) {
        return console.error(err); // Use console.error for errors
    }

    if (result.length > 0)
    { // Check if any results found
        const car = result[0];
        maxRange = car.range_ev; // Assuming max_range is the column for range
         // Assuming max_range is the column for range
        console.log(`Car found: ${carBrand} ${carModel} (${carYear})`);
        console.log(result)
        console.log(maxRange);
    }
    else
    {
        console.log(`Car not found: ${carBrand} ${carModel} (${carYear})`);
    }
});

