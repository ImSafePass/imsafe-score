import Papa from "papaparse";

import {
  StateCorrections,
  LowMidHigh,
  PrevalenceMultiples,
} from "../redux/reducer";
import { NytObject, CSVRow, arrayToStateObject } from "./nyt";
import { TestRecord, ApiTestRecord, getTestRecords } from "./test";

interface ApiRecord {
  fields: any;
}
type AirtableResponse = { records: ApiRecord[] };

interface StateCorrectionRecord {
  fields: {
    state_name: string;
    state_correction_factor: string;
  };
}

interface Multiple {
  fields: {
    multiple_type: string;
    multiple_value: string;
    source: string;
  };
}

export const NytURL =
  "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";
export const stateCorrectionsURL = `https://api.airtable.com/v0/appTyS0afcxAaATA2/state_correction`;
export const prevalenceMultipleURL = `https://api.airtable.com/v0/appTyS0afcxAaATA2/case_to_total_multiple`;
export const testDataURL = `https://api.airtable.com/v0/appr9MAWe4qP3roEM/diagnostic_accuracy_data`;

const auth = `?api_key=${process.env.REACT_APP_AIRTABLE_API_KEY}`;

const fetchAirtable = (url: string): Promise<AirtableResponse> =>
  fetch(`${url}${auth}`)
    .then((r) => r.json())
    .catch((err) => {
      throw err;
    });

export const getNyt = () =>
  new Promise<NytObject>((resolve) => {
    fetch(NytURL)
      .then((r) => r.text())
      .then((csv) => {
        const json = Papa.parse(csv, { header: true });
        const stateObject: NytObject = arrayToStateObject(
          json.data as CSVRow[]
        );
        return resolve(stateObject as NytObject);
      })
      .catch((err) => {
        throw err;
      });
  });

export const getStateCorrections = () =>
  new Promise<StateCorrections>((resolve) => {
    fetchAirtable(stateCorrectionsURL)
      .then((json) => {
        const records: StateCorrectionRecord[] = json.records;
        const asObject: any = {};

        records.forEach((rec) => {
          const { state_name, state_correction_factor } = rec.fields;
          asObject[state_name] = parseFloat(state_correction_factor);
        });

        return resolve(asObject as StateCorrections);
      })
      .catch((err) => {
        throw err;
      });
  });

export const getPrevalenceMultiples = () =>
  new Promise<PrevalenceMultiples>((resolve) => {
    fetchAirtable(prevalenceMultipleURL)
      .then((json) => {
        const records: Multiple[] = json.records;
        const asObject: any = {};

        records.forEach((rec) => {
          const { multiple_type, multiple_value, source } = rec.fields;
          const key =
            multiple_type === "midpoint"
              ? "mid"
              : (multiple_type.split("_")[0] as LowMidHigh);
          asObject[key] = {
            value: parseFloat(multiple_value),
            source,
          };
        });

        return resolve(asObject as PrevalenceMultiples);
      })
      .catch((err) => {
        throw err;
      });
  });

export const getTests = () =>
  new Promise<TestRecord[]>((resolve) => {
    fetchAirtable(testDataURL).then((json) => {
      const records: ApiTestRecord[] = json.records as ApiTestRecord[];
      const testRecords: TestRecord[] = getTestRecords(records);
      resolve(testRecords);
    });
  });
