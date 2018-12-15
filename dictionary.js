const Dictionary = require("spellchecker");

// const { checkSpelling, getCorrectionsForMisspelling, isMisspelled } = Dictionary;
const splitWordOnSpace = (word = "") => {
    return word.split(" ");
};
const transform = (words = []) => {
    return words.reduce((acc, string) => {
        const splittedWords = splitWordOnSpace(string);
        // console.log({ splittedWords });
        const mappedSplittedWords = splittedWords.map(word => {
            console.log("Checking for word: ", { word });
            const misspelled = Dictionary.isMisspelled(word);
            const suggestions = misspelled ? Dictionary.getCorrectionsForMisspelling(word) : [];
            // const mySuggestions = misspelled
            //     ? Dictionary.checkSpelling(word).reduce((accl, length) => {
            //           // console.log("Correcting with length", { word, length });
            //           const suggestedWord = word.substr(length.start, length.end);
            //           const suggestion = Dictionary.getCorrectionsForMisspelling(suggestedWord);
            //           accl.push(...suggestion);
            //           return accl;
            //       }, [])
            //     : [];
            return { word, misspelled, suggestions };
        });

        const result = mappedSplittedWords.reduce((acc, wordSuggestion) => {
            acc += acc.length ? " " : "";
            return (acc += wordSuggestion.misspelled ? wordSuggestion.suggestions[0] : wordSuggestion.word);
        }, "");

        acc.push({ result, mappedSplittedWords });
        return acc;
    }, []);
};

const keywords = {
    "policy number": "policyNumber",
    "policy no.": "policyNumber",
    "policy no": "policyNumber",
    policy: "policyNumber",
    name: "name",
    vehicleType: "vehicleType",
    "vehicle Type": "vehicleType",
    displacement: "displacement",
    capacity: "displacement",
    registrationNumber: "registrationNumber",
    "registration number": "registrationNumber",
    "registration no.": "registrationNumber",
    "registration no": "registrationNumber",
    policyDate: "policyDate",
    "policy Date": "policyDate",
    "start date": "policyDate",
    policyExpiryDate: "policyExpiryDate",
    "policy Expiry Date": "policyExpiryDate",
    "expiry date": "policyExpiryDate",
    expiry: "policyExpiryDate",
    chassisNumber: "chassisNumber",
    "chassis number": "chassisNumber",
    "chassis no": "chassisNumber",
    "chassis no.": "chassisNumber",
    engineNumber: "engineNumber",
    "engine number": "engineNumber",
    "engine no.": "engineNumber",
    "engine no": "engineNumber",
    vehicleCompany: "vehicleCompany",
    "vehicle company": "vehicleCompany",
    maker: "vehicleCompany",
    company: "vehicleCompany"
};
let foundKeyWord = null;
const transformText = data => {
    if (!data) return { error: "No Data!" };
    const splittedData = data.split("\n");
    console.log({ splittedData });
    return splittedData
        .map(split => split.trim().toLowerCase())
        .reduce((acc, row) => {
            // console.log({ acc, row, foundKeyWord });
            const foundKeyValue = keywords[row];
            if (foundKeyValue) {
                foundKeyWord = foundKeyValue;
                // console.log({ foundKeyValue });
            }
            if (foundKeyWord && acc[foundKeyWord] === undefined) {
                // console.log("keyword not found!", foundKeyWord);
                acc[foundKeyWord] = "";
            } else if (foundKeyWord) {
                // console.log("Appending row:", row, " with key:", foundKeyWord);
                acc[foundKeyWord] += row;
            }
            return acc;
        }, {});
};

module.exports = { transform, transformText };
