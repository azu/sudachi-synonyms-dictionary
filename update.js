const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");
const { parse } = require("sudashi-synonyms-parser");
const OUTPUT_PATH = path.join(__dirname, "sudashi-synonyms-dictionary.json");
const DICT_URL = "https://raw.githubusercontent.com/WorksApplications/SudachiDict/develop/src/main/text/synonyms.txt";
(async function () {
    const dictText = await fetch(DICT_URL).then(res => res.text());
    const json = parse(dictText);
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(json), "utf-8");
})();
