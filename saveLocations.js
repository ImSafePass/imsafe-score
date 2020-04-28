const fs = require("fs");
const Papa = require("papaparse");
const fetch = require("node-fetch");

fetch(
  "https://raw.githubusercontent.com/scpike/us-state-county-zip/master/geo-data.csv"
)
  .then((r) => r.text())
  .then((csv) => {
    const data = Papa.parse(csv, { header: true }).data;
    const byState = {};
    data.forEach(({ state, county, zipcode }) => {
      if (byState[state]) {
        if (byState[state][county]) {
          byState[state][county].push(zipcode);
        } else {
          byState[state][county] = [zipcode];
        }
      } else {
        byState[state] = {
          [county]: [zipcode],
        };
      }
    });

    fs.writeFileSync(
      "./src/data/states.json",
      JSON.stringify(Object.keys(byState))
    );

    Object.keys(byState).forEach((state) => {
      fs.writeFileSync(
        `./src/data/states/${state}.json`,
        JSON.stringify(byState[state])
      );
    });
  });
