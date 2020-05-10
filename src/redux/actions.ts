import { StateCorrections, PrevalenceMultiples } from "./reducer";
import { TestRecord, TestResult } from "../utils/test";
import { NytObject } from "../utils/nyt";

export const setTest = (test: TestRecord | undefined) => ({
  type: "SET_TEST",
  test,
});

export const setTests = (tests: TestRecord[]) => ({
  type: "SET_TESTS",
  tests,
});

export const setState = (state: string) => ({
  type: "SET_STATE",
  state,
});

export const setCounty = (county: string | undefined) => ({
  type: "SET_COUNTY",
  county,
});

export const setTestDate = (testDate: Date) => ({
  type: "SET_TEST_DATE",
  testDate,
});

export const setNyt = (nyt: NytObject) => ({
  type: "SET_NYT",
  nyt,
});

export const setStateCorrections = (stateCorrections: StateCorrections) => ({
  type: "SET_STATE_CORRECTIONS",
  stateCorrections,
});

export const setPrevalenceMultiples = (
  prevalenceMultiples: PrevalenceMultiples
) => ({
  type: "SET_PREVALENCE_MULTIPLES",
  prevalenceMultiples,
});

export const setTestResult = (testResult: TestResult) => ({
  type: "SET_TEST_RESULT",
  testResult,
});
