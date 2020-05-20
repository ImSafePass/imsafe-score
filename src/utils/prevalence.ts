import { NytObject } from "./nyt";
import { TestType, TestRecord } from "./test";
import { daysFrom, brief } from "./date";
import {
  ReduxState,
  LocationState,
  StateCorrections,
  PrevalenceMultiples,
  LowMidHigh,
} from "../redux/reducer";
import get from "lodash.get";
import { TriplePoint } from "./bayes";
import { localLog } from "./local";

type EstimatedCaseObject = { [K in LowMidHigh]: number };

export const presymptomaticDays = 5;
export const postsymptomaticPretestDays = 2;

export const activeInfectionLengthDays = 16;
export const antibodyDelayDays = 14;
export const preTestDays = presymptomaticDays + postsymptomaticPretestDays;

export const fullTestType = (testType: TestType) =>
  testType === "Serology"
    ? "Serological (Antibody)"
    : "Molecular (Active Infection)";

export const getRelevantDates = (testType: TestType, testDate: Date) => {
  if (testType === "Molecular") {
    const cutoffDate = daysFrom(-activeInfectionLengthDays, testDate);
    return [cutoffDate, testDate];
  } else {
    const relevantDate = daysFrom(-antibodyDelayDays, testDate);
    return [relevantDate];
  }
};

export interface Prevalence {
  basePopulation: number;
  testType: TestType;
  dates: Date[];
  relevantRawCases: number;
  estimatedCaseObject: EstimatedCaseObject;
}

export const getPrevalenceFromState = (state: ReduxState) => {
  const nyt = state.nyt as NytObject;
  const location = state.location as LocationState;
  const testDate = state.testDate as Date;
  const stateCorrections = state.stateCorrections as StateCorrections;
  const prevalenceMultiples = state.prevalenceMultiples as PrevalenceMultiples;
  const test = state.test as TestRecord;

  if (!stateCorrections || !prevalenceMultiples) {
    return undefined;
  }

  const stateCorrection = stateCorrections[location.state as string];

  const countyData = get(nyt, [
    location.state as string,
    location.county as string,
  ]);

  const dates = getRelevantDates(test.type, testDate);
  const datesWithCases = dates.map((date) => ({
    date,
    cases: (countyData[brief(date)] || { cases: 0 }).cases,
  }));

  const relevantRawCases =
    test.type === "Serology"
      ? datesWithCases[0].cases
      : datesWithCases[1].cases - datesWithCases[0].cases;

  const estimatedCaseObject: TriplePoint = { mid: 0 };
  const lowMidHigh = Object.keys(prevalenceMultiples) as LowMidHigh[];
  lowMidHigh.forEach((key) => {
    estimatedCaseObject[key] =
      prevalenceMultiples[key].value * stateCorrection * relevantRawCases;
  });

  localLog("CALCULATING PREVALENCE", {
    countyData,
    testDate,
    relevantDates: dates,
    testType: test.type,
    testObject: test,
    stateCorrection,
    basePopulation: location.countyPopulation,
    estimatedCaseObject,
  });

  return {
    basePopulation: location.countyPopulation as number,
    testType: test.type,
    estimatedCaseObject: estimatedCaseObject as EstimatedCaseObject,
    dates,
    relevantRawCases,
  };
};
