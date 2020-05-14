import { ApiTestRecord, parseTestRecord, TestRecord } from "../test";
import { NytObject } from "../nyt";
import {
  ReduxState,
  LocationState,
  StateCorrections,
  PrevalenceMultiples,
} from "../../redux/reducer";
import { daysFrom, brief } from "../date";
import {
  activeInfectionLengthDays,
  antibodyDelayDays,
  getPrevalenceFromState,
} from "../prevalence";

interface ApiTestRecordForSpec extends ApiTestRecord {
  specDescription: string;
}

// TEST RECORDS
export const insufficientScoring: ApiTestRecordForSpec = {
  id: "rec065zekjPAkDKjz",
  specDescription: "Bad: Insufficient Scoring",
  fields: {
    manufacturer: "Creative Diagnostics",
    diagnostic: "Creative Diagnostics",
    type: "Serology IgG only",
    manufacturer_document_link:
      "http://img2.creative-diagnostics.com/pdf/DEIASL019.pdf",
    manufacturer_document_type: "Publicity",
    "manufacturer_test_of_sensitivity,_min_days_post_onset": "100",
    "manufacturer_test_of_specificity,_min_days_post_onset": "100",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const manufacturerScoring: ApiTestRecordForSpec = {
  id: "rec0seOKmfxqCExzi",
  specDescription: "Good: Manufacturer Scoring",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "5/2/2020",
    manufacturer: "Roche Diagnostics",
    diagnostic: "Elecsys Anti-SARS-CoV-2",
    type: "Serology Antibody",
    fda_document_link: "https://www.fda.gov/media/137605/download",
    fda_document_type: "IFU",
    manufacturer_test_of_sensitivity: "100",
    "manufacturer_test_of_sensitivity_95%_ci": "88.1-100",
    "manufacturer_test_of_sensitivity,_min_days_post_onset": "14",
    manufacturer_test_of_specificity: "99.81",
    "manufacturer_test_of_specificity_95%_ci": "99.65-99.91",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const noLowHigh = {
  id: "rec0tkzwMe6QxQU6J",
  specDescription: "Bad: Insufficient Scoring",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "4/16/2020",
    manufacturer: "GenoSensor, LLC",
    diagnostic: "GS™ COVID-19 RT-PCR KIT",
    type: "Molecular",
    no_data: "https://www.fda.gov/media/137093/download",
    manufacturer_test_of_specificity: "99.81",
    manufacturer_test_of_sensitivity: "99",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const independentScoring = {
  id: "rec12v1BLYwIMdjuH",
  specDescription: "Good: Independent Scoring",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "4/14/2020",
    manufacturer: "Ortho Clinical Diagnostics, Inc.",
    diagnostic:
      "VITROS Immunodiagnostic Products Anti-SARS-CoV-2 Total Reagent Pack",
    type: "Serology Total Antibody",
    fda_document_link: "https://www.fda.gov/media/136967/download",
    fda_document_type: "IFU",
    manufacturer_test_of_sensitivity: "83.3",
    "manufacturer_test_of_sensitivity_95%_ci": "67.2-93.6",
    manufacturer_test_of_specificity: "99.5",
    "manufacturer_test_of_specificity_95%_ci": "99.1-100",
    independent_test_of_sensitivity: "82.3",
    "independent_test_of_sensitivity_95%_ci": "69.2-99.6",
    independent_test_of_specificity: "100",
    "independent_test_of_specificity_95%_ci": "99.9-100",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const badType = {
  id: "rec1I7KmfX33pcXX6",
  specDescription: "Bad: Missing Type",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "3/26/2020",
    manufacturer: "BGI Genomics Co. Ltd",
    diagnostic: "Real-Time Fluorescent RT-PCR Kit for Detecting SARS-CoV-2",
    type: "Made Up",
    fda_document_link: "https://www.fda.gov/media/136472/download",
    fda_document_type: "IFU",
    manufacturer_test_of_sensitivity: "88.1",
    "manufacturer_test_of_sensitivity_95%_ci": "81.2-92.7",
    manufacturer_test_of_specificity: "99.6",
    "manufacturer_test_of_specificity_95%_ci": "97.8-99.9",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const noManufacturer = {
  id: "rec1I7KmfX33pcXX6",
  specDescription: "Bad: Missing Manufacturer",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "3/26/2020",
    diagnostic: "Real-Time Fluorescent RT-PCR Kit for Detecting SARS-CoV-2",
    type: "Serology",
    fda_document_link: "https://www.fda.gov/media/136472/download",
    fda_document_type: "IFU",
    manufacturer_test_of_sensitivity: "88.1",
    "manufacturer_test_of_sensitivity_95%_ci": "81.2-92.7",
    manufacturer_test_of_specificity: "99.6",
    "manufacturer_test_of_specificity_95%_ci": "97.8-99.9",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const noDiagnostic = {
  id: "rec1I7KmfX33pcXX6",
  specDescription: "Bad: Missing Diagnostic",
  fields: {
    eua_listed_by_fda: "Y",
    eua_approval: "3/26/2020",
    type: "Serology",
    fda_document_link: "https://www.fda.gov/media/136472/download",
    fda_document_type: "IFU",
    manufacturer_test_of_sensitivity: "88.1",
    "manufacturer_test_of_sensitivity_95%_ci": "81.2-92.7",
    manufacturer_test_of_specificity: "99.6",
    "manufacturer_test_of_specificity_95%_ci": "97.8-99.9",
  },
  createdTime: "2020-05-07T19:45:59.000Z",
};

export const testExamples: ApiTestRecordForSpec[] = [
  insufficientScoring,
  manufacturerScoring,
  noLowHigh,
  independentScoring,
  badType,
  noManufacturer,
  noDiagnostic,
];

// OTHER DATA

const serologyRelevantCaseObj = {
  cases: 1700,
  deaths: 25,
};

const testDateCaseObj = {
  cases: 1980,
  deaths: 35,
};

const molecularCutoffCaseObj = {
  cases: 1600,
  deaths: 20,
};

const location: LocationState = {
  state: "California",
  county: "San Francisco",
  countyPopulation: 800000,
};

const stateCorrections: StateCorrections = {
  California: 1.02,
};

const prevalenceMultiples: PrevalenceMultiples = {
  low: { value: 10 },
  mid: { value: 15 },
  high: { value: 20 },
};

export const testDate = new Date("2020-05-12");
export const serologyRelevanceDate = daysFrom(-antibodyDelayDays, testDate);
export const molecularCutoffDate = daysFrom(
  -activeInfectionLengthDays,
  testDate
);

const nyt: NytObject = {
  California: {
    "San Francisco": {
      [brief(molecularCutoffDate)]: molecularCutoffCaseObj,
      [brief(serologyRelevanceDate)]: serologyRelevantCaseObj,
      [brief(testDate)]: testDateCaseObj,
    },
  },
};

export const baseState: ReduxState = {
  nyt,
  location,
  stateCorrections,
  prevalenceMultiples,
  testDate,
  test: parseTestRecord(manufacturerScoring) as TestRecord,
};

export const prevalence = (state: ReduxState = baseState) =>
  getPrevalenceFromState(state);
