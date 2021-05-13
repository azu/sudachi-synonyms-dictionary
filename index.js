function fetchDictionary() {
    return Promise.resolve(require("./sudachi-synonyms-dictionary"));
}

module.exports.fetchDictionary = fetchDictionary;
