import React, { ReactChild, ReactChildren } from "react";
import { Dispatch } from "redux";
import queryString from "query-string";

import { TestRecord, TestType, TestResult } from "../../utils/test";
import {
  LocationState,
  ReduxState,
  StateCorrections,
  PrevalenceMultiples,
} from "../../redux/reducer";
import { NytObject } from "../../utils/nyt";
import { Prevalence, getPrevalenceFromState } from "../../utils/prevalence";

export type QuestionName =
  | "intro"
  | "testType"
  | "test"
  | "testDate"
  | "location"
  | "testResult"
  | "display";

export const questionNames: QuestionName[] = [
  "testType",
  "test",
  "testDate",
  "location",
  "testResult",
];

export interface QuestionProps {
  questionName: QuestionName;
  testType?: TestType;
  test?: TestRecord;
  testDate: Date;
  location: LocationState;
  testResult?: TestResult;
  tests?: TestRecord[];
  nyt?: NytObject;
  prevalence: Prevalence;
  close: (questionName: QuestionName) => void;
  open: (questionName: QuestionName) => void;
  dispatch: Dispatch;
  countyOptions: string[];
  stateOptions: string[];
  stateCorrections?: StateCorrections;
  prevalenceMultiples?: PrevalenceMultiples;
}

export const mapStateToProps = (state: ReduxState) => {
  const testType = queryString.parse(window.location.search).type;
  const { location, nyt, test, stateCorrections, prevalenceMultiples } = state;
  const prevalence =
    test && location.state && location.county && nyt
      ? getPrevalenceFromState(state)
      : null;

  const countyOptions =
    location.state && nyt ? Object.keys(nyt[location.state]).sort() : undefined;

  return {
    testType,
    test: state.test,
    testDate: state.testDate,
    location: state.location,
    testResult: state.testResult,
    tests: state.tests,
    prevalence,
    stateOptions: nyt ? Object.keys(nyt).sort() : [],
    countyOptions,
    stateCorrections,
    prevalenceMultiples,
  } as Partial<QuestionProps>;
};

export const meetsRequirements = (props: QuestionProps): boolean => {
  const {
    questionName,
    testType,
    test,
    tests,
    location,
    prevalence,
    stateCorrections,
    prevalenceMultiples,
    testDate,
    testResult,
  } = props;

  const meetsTest = testType && tests;
  const meetsTestDate = meetsTest && tests && test;
  const meetsLocation = meetsTestDate && testDate;
  const meetsTestResult = location.state && location.county && prevalence;
  const requirements: { [key in QuestionName]: any } = {
    intro: true,
    testType: true,
    test: meetsTest,
    testDate: meetsTestDate,
    location: meetsLocation,
    testResult: meetsLocation && testDate && meetsTestResult,
    display:
      meetsLocation &&
      meetsTestResult &&
      testResult &&
      stateCorrections &&
      prevalenceMultiples,
  };

  return !!requirements[questionName];
};

export const QuestionText = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}) => <h3 className="text-xl text-blue-700">{children}</h3>;

export const Unimportant = ({
  children,
}: {
  children: ReactChild | ReactChildren;
}) => <span className="question__unimportant">{children}</span>;

export const makeOpener = (open: (qn: QuestionName) => void) => ({
  children,
  name,
}: {
  children: ReactChild;
  name: QuestionName;
}) => (
  <span className="question__opener" onClick={() => open(name)}>
    {children}
  </span>
);
