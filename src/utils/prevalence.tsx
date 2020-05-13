import React, { ReactElement } from "react";

import { NytCounty, NytObject, NytPoint } from "./nyt";
import { TestType, TestRecord } from "./test";
import { daysFrom, brief, spelled } from "./date";
import {
  PrevalenceDatePoint,
  ReduxState,
  LocationState,
  StateCorrections,
  PrevalenceMultiples,
  LowMidHigh,
} from "../redux/reducer";
import get from "lodash.get";

interface PrevalencePoint {
  percent: number;
  realCases: number;
  source: string;
}

export interface PrevalenceData {
  low: PrevalencePoint;
  midpoint: PrevalencePoint;
  high: PrevalencePoint;
  caseNumberDescription: ReactElement;
  knownCases: number;
}

type EstimatedCaseObject = { [K in LowMidHigh]: number };

export const presymptomaticDays = 5;
export const postsymptomaticPretestDays = 2;

export const activeInfectionLengthDays = 16;
export const antibodyDelayDays = 14;
export const preTestDays = presymptomaticDays + postsymptomaticPretestDays;

export const statePrevalenceURL = `https://api.airtable.com/v0/appTyS0afcxAaATA2/state_correction?api_key=${process.env.REACT_APP_AIRTABLE_API_KEY}`;
export const prevalenceMultipleURL = `https://api.airtable.com/v0/appTyS0afcxAaATA2/case_to_total_multiple?api_key=${process.env.REACT_APP_AIRTABLE_API_KEY}`;

export const fullTestType = (testType: TestType) =>
  testType === "Serology"
    ? "Serological (Antibody)"
    : "Molecular (Active Infection)";

/**
 * Relevant case number is determined by test type.
 */
// const getRelevantCaseObject = (
//   testDate: Date,
//   testType: TestType,
//   countyData: NytCounty
// ):
//   | {
//       molecularDates: {
//         cutoff: PrevalenceDatePoint;
//         test: PrevalenceDatePoint;
//       };
//     }
//   | { serologicalDate: PrevalenceDatePoint } => {
//   // For active infection tests, grab "active" cases at time of testing
//   if (testType === "Molecular") {
//     const cutoffDate = daysFrom(-activeInfectionLengthDays, testDate);

//     const testPoint = countyData[brief(testDate)] || { cases: 0 };
//     const cutoffPoint = countyData[brief(cutoffDate)] || { cases: 0 };
//     const cases = testPoint.cases - cutoffPoint.cases;
//     const caseNumberDescription = (
//       <>
//         <p>
//           For molecular (active infection) tests, we use estimated active cases
//           on your infection date -- calculated as cases on your test date (
//           {testPoint.cases} on {spelled(testDate)}) minus the number of those
//           cases estimated to no longer be infectious (because they have passed
//           the average {activeInfectionLengthDays} days of active infection).
//         </p>
//         <p>
//           That totals an estimated {cases} measured cases that were active at
//           the time you were tested.
//         </p>
//       </>
//     );

//     return {
//       molecularDates: {
//         cutoff: {
//           date: cutoffDate,
//           cases: cutoffPoint.cases,
//         },
//         test: {
//           date: testDate,
//           cases: testPoint.cases,
//         },
//       },
//     };

//     // For serological tests, grab ALL cases prior to beginning of infection
//   } else {
//     const relevantDate = daysFrom(-antibodyDelayDays, testDate);
//     const relevantPoint = countyData[brief(relevantDate)] || { cases: 0 };
//     const cases = relevantPoint.cases;
//     const caseNumberDescription = (
//       <>
//         <p>
//           For serological (antibody) tests, we calculate your "prior
//           probability" of being immune based on the total known number of cases
//           up to the date when you would have been infected (your test date minus
//           the {antibodyDelayDays} average days it takes to build antibodies).
//         </p>
//         <p>
//           That number is {cases} cases in your county on {spelled(relevantDate)}
//           , {antibodyDelayDays} before you were tested.
//         </p>
//       </>
//     );
//     return {
//       serologicalDate: {
//         date: relevantDate,
//         cases,
//       },
//     };
//     // return { cases, caseNumberDescription };
//   }
// };

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

  const estimatedCaseObject: any = {};
  const lowMidHigh = Object.keys(prevalenceMultiples) as LowMidHigh[];
  lowMidHigh.forEach((key) => {
    estimatedCaseObject[key] =
      prevalenceMultiples[key].value * stateCorrection * relevantRawCases;
  });

  return {
    basePopulation: location.countyPopulation as number,
    testType: test.type,
    estimatedCaseObject: estimatedCaseObject as EstimatedCaseObject,
    dates,
    relevantRawCases,
  };
};
