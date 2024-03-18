const { sqrt } = require('mathjs')
const express = require('express');
var mysql = require('mysql');
const cors = require('cors');
const pathUtils = require('./pathfinder.js');

startLoc = [20.69814707433358, 77.00440792624494];
endLoc = [19.054289856431033, 72.8454073286699];
currentCharge = 50;
maxRange = 300;
chargeStd = "05V2LHG";

pathThing = pathUtils.pathFindingAlgorithm(startLoc,endLoc,currentCharge,maxRange,chargeStd);
console.log(pathThing)