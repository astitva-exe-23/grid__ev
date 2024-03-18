const { sqrt, max} = require('mathjs')

accel_x = 4 // m/s2
accel_y = 0.0
accel_z = 0.0
motor_voltage = 725.0 //V
battery_voltage = 800.0 // V
max_motor_power = 440000.0 //W
velocityC = 27.78 // m/s
velocityP = 20 // m/s
weight = 2880.0 // kg
efficiency = 186 // Wh/km
time = 5//s
estimated_discharge_rate = dischargeRate(accel_x, accel_y, accel_z, motor_voltage, battery_voltage, max_motor_power, velocityC,velocityP, weight,efficiency,time)

console.log("Estimated Discharge Rate:", estimated_discharge_rate, "A");
function dischargeRate(accelX,accelY,accelZ,motorVoltage,batteryVoltage,power,velocityCurrent,velocityPast,weight,efficiency,time,correctionFactor)
{
    let estVel = 100; //velocity assumed to be 100km/h
    let distancePerkWh = 1000/efficiency;   // km covered after consuming 1kwh
    let timeTakenPerkWh = distancePerkWh/100; // TIME IN HOURS
    timeTakenPerkWh = timeTakenPerkWh*3600; // convert to seconds
    let powerCalculations = 1000/timeTakenPerkWh; // How many Wh consumed persecond
    let wattSeconds = powerCalculations*3600; // Power in WattSeconds
    let cruiseCurrent = wattSeconds/motorVoltage;
    console.log(cruiseCurrent);


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
    let keDiff = 0.5*weight*((velocityCurrent*velocityCurrent)-(velocityPcaast*velocityPast));
    let pwr = keDiff/time;
    let current =correctionFactor*pwr/motorVoltage;
    console.log("Current "+current)
    //let discharge_rate = (ws/motorVoltage)+ampMom;
    return current;

}
