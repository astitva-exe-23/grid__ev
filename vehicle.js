var carData = {
    Audi: [
        "SQ8 e-tron","SQ8 e-tron Sportback","e-tron 55 quattro",
        "e-tron 55 quattro","Q4 e-tron 55 quattro",
        "Q8 e-tron 50 quattro","Q8 e-tron Sportback 50 quattro",
        "e-tron 50 quattro","Q4 Sportback e-tron 45"],
    BMW: ["i7 M70xDrive","i4 M50","i7 xDrive60","iX xDrive50",
    "i7 eDrive50","i4 eDrive40",
    "i5 eDrive40 Touring",
    "iX xDrive40",
    "iX1 xDrive30",
    "i4 eDrive35",
    "iX3"
    ],
    BYD:["SEAL 82.5 kWh AWD Excellence","HAN","TANG",
    "SEAL 82.5 kWh RWD Design","SEAL U 71.8 kWh Comfort",
    "ATTO 3","DOLPHIN 60.4 kWh"],
    Citroen: ["e-C4 54 kWh", "e-C4 X 54 kWh", "e-C4 X", "e-C3" ],
    CUPRA:["TavascanZ", "Tavascan Endurance"],
    Dacia:["Spring Electric 65", "Spring Electric 45"],
    DS:["3 Crossback E-Tense"],
    eGo:["e.wave X"],
    Fiat:["500e Hatchback 42 kWh", "500e 3+1 24 kWh", "500e Cabrio 24 kWh", "500e Hatchback 24 kWh"],
    Fisker:["Ocean Extreme"],
    Ford:["Mustang Mach-E GT", "Mustang Mach-E ER AWD", "Mustang Mach-E SR RWD"],
    Genesis:["GV70 Electrified Sport", "GV60 Sport", "GV60 Premium"],
    GWM:["ORA 3 48 kWh", "ORA 3 GT"],
    Honda:["e:Ny1"],
    Hongqi:["E-HS9 99 kWh"],
    Hyundai:["IONIQ 5 Long 2WD", "IONIQ 6 Long 2WD", "Kona Electric 65 kWh", "Kona Electric 64 kWh", "IONIQ Electric", "Kona Electric 39 kWh"],
    Jaguar:["I-Pace EV400"],
    Jeep:["Avenger Electric"],
    Kia:["EV6 GT", "EV9 99.8 kWh AWD", "EV6 Long 2WD", "Niro EV", "e-Soul 64 kWh", "e-Soul 64 kWh", "e-Niro 39 kWh", "e-Niro 39 kWh", "e-Soul 39 kWh"],
    Lotus:["Eletre R", "Emeya R", "Eletre S", "Emeya S", "Emeya"],
    Lucid:["Air Grand Touring", "Air Touring", "Air Pure RWD"],
    Maserati:["GranTurismo Folgore", "Grecale Folgore"],
    Mercedes_Benz:["EQE SUV AMG 53 4MATIC+", "EQS 580 4MATIC", "EQE AMG 43 4MATIC", "EQE SUV AMG 43 4MATIC", "EQS 500 4MATIC", "EQS 450 4MATIC", "EQS SUV 450 4MATIC",
     "EQB 350 4MATIC", "EQE 350+", "EQE SUV 350+", "EQE SUV 300", "EQB 300 4MATIC", "EQT 200 Standard", "eVito Tourer Long 41 kWh"],
    MG:["Marvel R Performance", "MG4 Electric 64 kWh", "Marvel R", "ZS EV Standard", "ZS EV Long", "ZS EV"],
    Mini:["Countryman SE ALL4", "Cooper SE"],
    NIO:["ET7 100 kWh", "EL6 100 kWh", "ET5 Touring 75 kWh"],
    Nissan:["Ariya e-4ORCE 87kWh - 290 kW", "Ariya 87kWh", "Leaf"],
    Opel:["Corsa Electric 51 kWh", "Corsa Electric 50 kWh", "Mokka-e 50 kWh"],
    Peugeot:["e-3008 98 kWh Long", "e-3008 73 kWh", "e-2008 54 kWh", "e-308 SW", "e-2008 50 kWh", "e-208 50 kWh"],
    Polestar:["4 Long Dual Motor", "3 Long Dual motor", "4 Long Single Motor"],
    Porsche:["Taycan Turbo GT", "Taycan Turbo GT Weissach", "Taycan Turbo S", "Taycan Turbo S Cross Turismo", "Taycan Turbo S Sport Turismo", "Taycan Turbo", 
    "Taycan Turbo Cross Turismo", "Taycan Turbo Sport Turismo", "Macan Turbo Electric", "Taycan 4S Cross Turismo", "Taycan 4S Plus", "Taycan 4S Plus Sport Turismo",
     "Taycan GTS", "Taycan GTS Sport Turismo", "Taycan 4S", "Taycan 4S Sport Turismo", "Taycan 4 Cross Turismo", "Taycan Plus",
     "Taycan Plus Sport Turismo", "Macan 4 Electric", "Taycan", "Taycan Sport Turismo"],
     Renault:["Megane E-Tech EV60 220hp", "Scenic E-Tech EV87 220hp", "Scenic E-Tech EV60 170hp", "5 E-Tech 52kWh 150hp", "Megane E-Tech EV40 130hp", "Megane E-Tech EV60 130hp",
      "5 E-Tech 40kWh 120hp", "Kangoo E-Tech Electric", "Zoe ZE50 R110", "Zoe ZE40 R110"],
      RollsRoyce:["Spectre"],
      Seres:["3"],
      Skoda:["Enyaq Coupe RS", "Enyaq 85", "Enyaq 85x", "Enyaq Coupe 85x", "Enyaq Coupe 60", "CITIGOe iV"],
      Smart:["#1 Pulse", "#1 Pro", "#3 Premium", "EQ forfour", "EQ fortwo cabrio", "EQ fortwo coupe"],
      SsangYong:["Korando e-Motion"],
      Tesla:["Model S Plaid", "Model X Plaid", "Model S Dual Motor", "Model S 100D", "Model Y Performance", "Model Y Long Dual Motor", "Model 3 Long Dual Motor",
       "Model 3 Long Performance", "Model 3 Long RWD", "Model 3 Performance", "Model 3 Standard Plus", "Model 3 Standard Plus LFP", "Model S 90D", "Model S 85", 
       "Model S 85D", "Model S 60D", "Model S 60"],
       Toyota:["bZ4X FWD"],
       VinFast:["VF 8 Eco Extended"],
       Volkswagen:["ID.4 GTX", "ID.4 Pro", "ID.7 Pro", "ID.4 Pro 4MOTION", "ID.3 Pro", "ID.4 Pure", "e-Up!"],
       Volvo:["EX90 Twin Motor Performance", "EC40 Twin Motor", "EX40 Twin Motor", "EX90 Single Motor", "EX30 Single Motor", "EX30 Single Motor ER", "EX40 Single Motor"],
       Voyah:["Free 106 kWh"],
       XPENG:["P7 AWD Performance", "P7 Wing Edition", "G9 RWD Long", "G9 RWD Standard", "P7 RWD Long"],
       Zeekr:["001 Long RWD"]
}

// window.onload = function(){
//     const brands = document.getE1ementById( 'brand');
//     const model = document.getE1ementById('state');
//     const selects = document.querySelectorAll('select');
//     model.disabled = true;
//     selects.forEach(select => {
//         if(select.disabled == true)
//         {
//             select.style.cursor="auto"
//         }
//     })
//     for(let brand in ModelInfo){
//         brands.options[brand.options.length]= new Option(brand, brand)

//         model.onchange = (e) => {
//             model.disabled = false;
//         }
//     }
// }
const brandDropdown = document.getElementById('brand');
const modelDropdown = document.getElementById('model');



function populateModelDropdown(selectedBrand) {
  modelDropdown.innerHTML = ''; // Clear previous options
  const modelOptions = carData[selectedBrand] || [];

  modelOptions.forEach((model) => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelDropdown.appendChild(option);
  });

  if (modelOptions.length === 0) {
    modelDropdown.classList.add('disabled'); // Visually disable if no models
  } else {
    modelDropdown.classList.remove('disabled');
  }
}

brandDropdown.addEventListener('change', function() {
  const selectedBrand = this.value;
  populateModelDropdown(selectedBrand);
});

// Optional initial population (if any)
populateModelDropdown(brandDropdown.value); // Based on pre-selected brand (if any)
