import { getPrevalenceFromState, getRelevantDates } from "../prevalence";
import { brief } from "../date";

import { parseTestRecord } from "../test";
import {
  manufacturerScoring,
  testDate,
  serologyRelevanceDate,
  molecularCutoffDate,
  baseState,
  prevalence,
} from "./examples";

describe("prevalence", () => {
  describe("getRelevantDates", () => {
    it("dates are correctly set", () => {
      expect(brief(testDate)).toEqual("2020-05-12");
      expect(brief(serologyRelevanceDate)).toEqual("2020-04-28");
      expect(brief(molecularCutoffDate)).toEqual("2020-04-26");
    });

    it("serological - gets antibodyDelayDays before test date", () => {
      const dates = getRelevantDates("Serology", testDate);
      expect(dates).toEqual([serologyRelevanceDate]);
    });

    it("molecular - gets activeInfectionLengthDays before test date", () => {
      const dates = getRelevantDates("Molecular", testDate);
      expect(dates).toEqual([molecularCutoffDate, testDate]);
    });
  });

  describe("getPrevalenceFromState", () => {
    it("serological - correctly calculates all prevalence information", () => {
      const prev = prevalence();
      expect(prev).toEqual({
        basePopulation: 800000,
        dates: [serologyRelevanceDate],
        estimatedCaseObject: {
          high: 34680,
          low: 17340,
          mid: 26010,
        },
        relevantRawCases: 1700,
        testType: "Serology",
      });
    });

    it("molecular - correctly calculates all prevalence information", () => {
      const state = { ...baseState };
      const parsed = state.test;
      parsed.type = "Molecular";
      const prev = prevalence(state);
      expect(prev.dates).toEqual([molecularCutoffDate, testDate]);
      expect(prev.relevantRawCases).toEqual(380);
      expect(prev.testType).toEqual("Molecular");
      expect(parseInt(prev.estimatedCaseObject.high.toString())).toEqual(7751);
      expect(parseInt(prev.estimatedCaseObject.low.toString())).toEqual(3875);
      expect(parseInt(prev.estimatedCaseObject.mid.toString())).toEqual(5814);
    });
  });
});
