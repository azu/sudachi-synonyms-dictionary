const fs = require("fs");
const util = require("util");
const path = require("path");
const fetch = require("node-fetch");
const { parse } = require("sudashi-synonyms-parser");
const semver = require("semver");
const OUTPUT_PATH = path.join(__dirname, "sudachi-synonyms-dictionary.json");
const DICT_URL = "https://raw.githubusercontent.com/WorksApplications/SudachiDict/develop/src/main/text/synonyms.txt";
(async function () {
    const dictText = await fetch(DICT_URL).then(res => res.text());
    const json = parse(dictText);
    const prevJSON = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));
    if (util.isDeepStrictEqual(JSON.parse(JSON.stringify(json)), prevJSON)) {
        return;
    }
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(json), "utf-8");
    // update major
    const pkg = require("./package.json");
    pkg.version = semver.inc(pkg.version, "major");
    fs.writeFileSync(path.join(__dirname, "package.json"), JSON.stringify(pkg, null, 2) + "\n", "utf-8");
})();
