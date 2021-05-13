const fs = require("fs");
const util = require("util");
const path = require("path");
const fetch = require("node-fetch");
const { parse } = require("sudachi-synonyms-parser");
const semver = require("semver");
const OUTPUT_ESM_PATH = path.join(__dirname, "index.module.js");
const OUTPUT_PATH = path.join(__dirname, "sudachi-synonyms-dictionary.json");
const DICT_URL = "https://raw.githubusercontent.com/WorksApplications/SudachiDict/develop/src/main/text/synonyms.txt";
(async function () {
    const dictText = await fetch(DICT_URL).then(res => res.text());
    const json = parse(dictText);
    const prevJSON = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    if (util.isDeepStrictEqual(JSON.parse(JSON.stringify(json)), prevJSON)) {
        return;
    }
    // perf: https://www.youtube.com/watch?v=ff4fgQxPaO0
    const esm = `export function fetchDictionary(){
    return Promise.resolve(JSON.parse(\`${JSON.stringify(json)}\`))
}`;
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(json), "utf-8");
    fs.writeFileSync(OUTPUT_ESM_PATH, esm, "utf-8");
    // update major
    const pkg = require("./package.json");
    pkg.version = semver.inc(pkg.version, "major");
    fs.writeFileSync(path.join(__dirname, "package.json"), JSON.stringify(pkg, null, 2) + "\n", "utf-8");
})();
