const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;

const router = express.Router();
const app = express();

const { transform, transformText } = require("./dictionary");
const { find, massageData, extractRegistratioNumber } = require("./registration");

app.use(bodyParser.json());

router.post("/transform", (req, res) => {
    const { words = [] } = req.body;
    console.log(`transforming: `, { words });
    const response = transform(words);
    res.json(response);
});

router.post("/registration", (req, res) => {
    const { data = [] } = req.body;
    console.log(`transforming: `, { data });
    const imageData = extractRegistratioNumber(data);
    // imageData.registrationNumber
    find()
        .then(massageData)
        .then(response => {
            res.json({ ...imageData, ...response });
        })
        .catch(e => res.send(e.stack));
});

router.get("/registration/:number", (req, res, next) => {
    const { number = "PB65R8674" } = req.params;
    const upperCaseNumber = number.toUpperCase();
    find(upperCaseNumber)
        .then(response => {
            res.json(response);
        })
        .catch(e => res.send(e));
});

router.all("/", (req, res) => res.json({ status: 404 }));

app.use("/api", router);
app.listen(PORT, () => {
    console.log("App listening on ", PORT);
});
