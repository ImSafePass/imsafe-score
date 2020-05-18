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

import { QuestionName } from "./helpers";
import InfoColumn from "./InfoColumn";
import QuestionColumn from "./QuestionColumn";

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

  return {
    stateOptions: nyt ? Object.keys(nyt).sort() : [],
    countyOptions:
      location.state && nyt
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
  const [open, setOpen] = useState<{ [key in QuestionName]: boolean }>({
    intro: !qs.type,
    testType: !qs.type,
    test: !test,
    testDate: !testDate,
    location: !(location.state && location.county),
    testResult: !testResult,
    display: true,
  });

  const questions: { [key in QuestionName]: any } = {
    intro: open.intro,
    testType: !qs.type || open.testType,
    test: !test || open.test,
    testDate: !testDate || open.testDate,
    location: !location.state || !location.county || open.location,
    testResult: !testResult || open.testResult,
    display: true,
  };

  const currentQuestionName = (Object.keys(questions) as QuestionName[]).find(
    (key) => questions[key]
  ); // Name of first unanswered or open question

  const openQuestion = (questionName: QuestionName) =>
    setOpen({ ...open, [questionName]: true });
  const closeQuestion = (questionName: QuestionName) =>
    setOpen({ ...open, [questionName]: false });

  useEffect(() => {
    setOpen({
      intro: !qs.type,
      testType: !qs.type,
      test: !test,
      testDate: !testDate,
      location: !(location.state && location.county),
      testResult: !testResult,
      display: true,
    });
  }, [test, testDate, testResult, location, qs.type]);

  if (
    currentQuestionName &&
    !["display", "intro"].includes(currentQuestionName)
  ) {
    return (
      <div className="flex lg:flex-row flex-col w-full items-center justify-center">
        <div
          className={`flex flex-col w-full py-4 lg:pr-8 ${
            currentQuestionName === "intro" ? "" : "lg:w-1/2"
          }`}
        >
          <QuestionColumn
            // @ts-ignore
            questionName={currentQuestionName}
            close={closeQuestion}
            open={openQuestion}
          />
        </div>
        <div className="flex flex-col w-full lg:w-1/2 py-4 lg:pl-8">
          <InfoColumn
            // @ts-ignore
            questionName={currentQuestionName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full justify-start">
      <QuestionColumn
        // @ts-ignore
        questionName={currentQuestionName}
        close={closeQuestion}
        open={openQuestion}
      />
    </div>
  );
};

export default connect(mapStateToProps)(Main as ComponentType);
