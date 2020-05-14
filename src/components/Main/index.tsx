import React, { ComponentType, useState, useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import queryString from "query-string";

import "react-datepicker/dist/react-datepicker.css";
import "./index.scss";

import { ReduxState } from "../../redux/reducer";

import { TestRecord, TestResult } from "../../utils/test";
import { NytObject } from "../../utils/nyt";
import { LocationState } from "../../redux/reducer";

import ResultsCard from "../ResultsCard";

import TestTypeQuestion from "../questions/TestTypeQuestion";
import TestQuestion from "../questions/TestQuestion";
import TestDateQuestion from "../questions/TestDateQuestion";
import LocationQuestion from "../questions/LocationQuestion";
import TestResultQuestion from "../questions/TestResultQuestion";

interface Props {
  stateOptions: string[];
  countyOptions?: string[];
  testDate?: Date;
  test?: TestRecord;
  tests: TestRecord[];
  testTypes: string[];
  testResults: TestResult[];
  testResult: TestResult;
  location: LocationState;
  dispatch: Dispatch;
}

const mapStateToProps = (state: ReduxState) => {
  const nyt: NytObject = state.nyt as NytObject;
  const location = state.location;
  const testTypeObj: any = {};

  return {
    stateOptions: nyt ? Object.keys(nyt).sort() : [],
    countyOptions: location.state
      ? Object.keys(nyt[location.state]).sort()
      : undefined,
    testDate: state.testDate,
    test: state.test,
    tests: state.tests,
    testResults: ["Positive", "Negative", "Indeterminate"],
    testResult: state.testResult,
    location,
  };
};

const Main = ({ testDate, test, location, testResult }: Props) => {
  const qs = queryString.parse(window.location.search);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({
    testType: !qs.type,
    test: !test,
    testDate: !testDate,
    location: !(location.state && location.county),
    testResult: !testResult,
  });

  const questions = [
    !qs.type || open.testType,
    !test || open.test,
    !testDate || open.testDate,
    !location.state || !location.county || open.location,
    !testResult || open.testResult,
  ];

  const questionToDisplayIndex = questions.findIndex((pair) => pair); // First unanswered or open question

  const questionEls = [
    TestTypeQuestion,
    TestQuestion,
    TestDateQuestion,
    LocationQuestion,
    TestResultQuestion,
  ];
  const Current = questionEls[questionToDisplayIndex] || ResultsCard;

  const openQuestion = (questionName: string) =>
    setOpen({ ...open, [questionName]: true });
  const closeQuestion = (questionName: string) =>
    setOpen({ ...open, [questionName]: false });

  useEffect(() => {
    setOpen({
      testType: !qs.type,
      test: !test,
      testDate: !testDate,
      location: !(location.state && location.county),
      testResult: !testResult,
    });
  }, [test, testDate, testResult, location, qs.type]);

  return (
    <div className="mx-auto max-w-4xl my-10">
      <Current
        remainingNum={questions.length - questionToDisplayIndex}
        open={openQuestion}
        close={closeQuestion}
      />
    </div>
  );
};

export default connect(mapStateToProps)(Main as ComponentType);
