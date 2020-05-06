const fs = require("fs");
const fetch = require("node-fetch");

const get = require("lodash.get");
const set = require("lodash.set");

require("dotenv").config();

const getCountyPopulation = async () => {
  const airtableData = await getAirtableData();

  airtableData["Missouri"]["Kansas City"] = 491918;

  Object.keys(airtableData).forEach(async (state) => {
    await fs.writeFileSync(
      `./data/county-populations/${state}.js`,
      `export default ${airtableData[state]}`
    );
    console.log(`Wrote ${state} data.`);
  });
};

const getAirtableData = async (airtableData = {}, offset = undefined) => {
  const { AIRTABLE_API_KEY, AIRTABLE_COUNTY_POP_ID } = process.env;
  let url = `https://api.airtable.com/v0/${AIRTABLE_COUNTY_POP_ID}/county_population?api_key=${AIRTABLE_API_KEY}`;
  if (offset) {
    url = `${url}&offset=${offset}`;
  }

  const results = await fetch(url);
  const json = await results.json();
  json.records.forEach((record) => {
    const { state_name, county_name, county_population } = record.fields;
    if (!get(airtableData, [state_name, county_name])) {
      set(airtableData, [state_name, county_name], county_population);
    }
  });

  if (json.offset) {
    return await getAirtableData(airtableData, json.offset);
  } else {
    return airtableData;
  }
};

getCountyPopulation();
