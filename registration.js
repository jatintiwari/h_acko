const redis = require("redis");
const Redis = redis.createClient();

Redis.on("error", err => {
    console.log("Redis Error " + err);
});

const Registration = require("car-registration-api-india");
const CAR = "Car";
const MOTORCYCLE = "Bike";

exports.find = (number = "KA51HA1551") => {
    return new Promise((resolve, reject) => {
        if (!number) return resolve({ data: "NA" });
        Redis.get(number, (err, reply) => {
            if (reply !== null) {
                console.log("Key found! Loading data from cache", number);
                resolve({
                    data: JSON.parse(reply),
                    cached: true
                });
            } else {
                console.log("Key not found! Hitting API", number);
                Registration.CheckCarRegistrationIndia(number, "jatintiwari", data => {
                    Redis.set(number, JSON.stringify(data));
                    console.log("Found data!", JSON.stringify(data));
                    resolve({ data, cache: false });
                });
            }
        });
    });
};

const recognizeVehicleType = (vehicleModel = "") => {
    const model = vehicleModel.toLowerCase();
    const carRegex = /hyundai|maruti|nissan|ford|toyota|tata/;
    const motorcyleRegex = /yamaha|honda|hero|ktm|kawasaki|suzuki|bajaj/;
    try {
        if (model.match(carRegex)) {
            return CAR;
        }

        if (model.match(motorcyleRegex)) {
            return MOTORCYCLE;
        }
        return CAR;
    } catch (e) {
        return CAR;
    }
};

const getPremium = (vehicleModel = "") => {
    const model = recognizeVehicleType(vehicleModel);
    if (model === CAR) {
        return 10000;
    } else {
        return 2000;
    }
};

exports.massageData = ({ data }) => {
    const {
        Description,
        RegistrationYear,
        CarMake = {},
        CarModel = {},
        EngineSize = {},
        MakeDescription = {},
        ModelDescription = {},
        VechileIdentificationNumber,
        NumberOfSeats = {},
        Colour,
        Owner: name = "",
        EngineNumber,
        FuelType = {},
        RegistrationDate,
        Location: location
    } = data;
    return {
        name,
        description: Description,
        registrationYear: RegistrationYear,
        vehicleCompany: CarMake.CurrentTextValue,
        vehicleModel: CarModel.CurrentTextValue,
        displacement: EngineSize.CurrentTextValue,
        makeDescription: MakeDescription.CurrentTextValue,
        modelDescription: ModelDescription.CurrentTextValue,
        chassisNumber: VechileIdentificationNumber,
        numberOfSeats: NumberOfSeats.CurrentTextValue,
        colour: Colour,
        engineNumber: EngineNumber,
        fuelType: FuelType.CurrentTextValue,
        registrationDate: RegistrationDate,
        location,
        vehicleType: recognizeVehicleType(CarMake.CurrentTextValue),
        premium: getPremium(CarMake.CurrentTextValue)
    };
};

exports.extractRegistratioNumber = data => {
    const splittedData = data.split("\n");
    const regex = new RegExp(
        /[ML|AS|MN|BR|MP|CG|MZ|CH|NL|DD|OD|DL|PB|DN|PY|GA|RJ|GJ|SK|HR|TN|HP|TR|JH|TS|JK|UK|KA|UP|KL]{2}[0-9]{2}[a-zA-Z]{2}[0-9]{4}/
    );
    const regex1 = new RegExp(
        /(([ML|AS|MN|BR|MP|CG|MZ|CH|NL|DD|OD|DL|PB|DN|PY|GA|RJ|GJ|SK|HR|TN|HP|TR|JH|TS|JK|UK|KA|UP|KL]){2}(|-)(?:[0-9]){1,2}(|-)(?:[A-Za-z]){2}(|-)([0-9]){1,4})|(([A-Za-z]){2,3}(|-)([0-9]){1,4})/
    );
    const registrationNumber = splittedData.reduce((acc, row) => {
        const upperCaseRowNonSpaced = row.toUpperCase().replace(/[^a-zA-Z0-9]/g, "");
        // if (row.length > 15) return acc;
        const match = upperCaseRowNonSpaced.match(regex);
        const match1 = upperCaseRowNonSpaced.match(regex1);
        if (match && match.length) {
            console.log({ match });
            acc = match[0];
        }
        //  else if (match1 && match1.length) {
        //     console.log({ match1 });
        //     acc = match1[0];
        // }
        return acc;
    }, null);
    console.log({ registrationNumber });
    return { registrationNumber };
};
