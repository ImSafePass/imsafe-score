import React, { ComponentType } from "react";
import Select, { OptionTypeBase } from "react-select";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import queryString from "query-string";

import { setState, setCounty, setTestResult } from "../../redux/actions";
import {
  BaseQuestionProps,
  stringArrayToOptionType,
  stringToOptionType,
} from "../../utils/question";
import { TestType, TestRecord, TestResult } from "../../utils/test";
import { fullTestType } from "../../utils/prevalence";
import { ReduxState, LocationState } from "../../redux/reducer";
import { spelled } from "../../utils/date";

import { makeOpener, Unimportant as U } from "./common";

const results: TestResult[] = ["Negative", "Positive"];

interface Props extends BaseQuestionProps {
  location: LocationState;
  testDate?: Date;
  test: TestRecord;
  testResult: TestResult;
}

const mapStateToProps = (state: ReduxState) => {
  return {
    location: state.location,
    testDate: state.testDate,
    test: state.test as TestRecord,
    testResult: state.testResult,
  };
};

const TestResultQuestion: React.SFC<Props> = ({
  remainingNum,
  close,
  open,
  testDate,
  location,
  test,
  dispatch,
  testResult,
}) => {
  const qs = queryString.parse(window.location.search);
  const testType = qs.type as TestType;

  const full = {
    Positive: `Positive (showing ${
      testType === "Serology" ? "antibodies" : "infection"
    })`,
    Negative: `Negative or indeterminate (not showing ${
      testType === "Serology" ? "antibodies" : "infection"
    })`,
  };

  const O = makeOpener(open);

  if (!testDate) {
    return null;
  }

  const description = `
    On April 12, 2020 in San Francisco, CA estimated prevalence for COVID19 antibodies ranged from between 2.53% and 9.58% with our base case of 5.32%.

    We consider 5.32% to be your pre-test probability of being positive for antibodies.
  `;

  return (
    <div className="question flex flex-row">
      <div className="flex flex-col items-start justify-center">
        <h3 className="question__question">
          On <O name="testDate">{spelled(testDate)}</O>
          <U> in </U>
          <O name="location">
            <>
              {location.county}, {location.state}
            </>
          </O>
          <U> you took a </U>
          <O name="testType">{fullTestType(testType).toLowerCase()}</O>
          <U> diagnostic from </U>
          <O name="test">{test.manufacturer}</O>
          <U> known as "</U>
          <O name="test">{test.diagnostic}</O>
          <U>". </U>
          <br />
          Where was your test administered (or where have you been most in prior
          month)?
        </h3>
        <Select
          className="select"
          options={results.map(
            (r) => ({ value: r, label: full[r] } as OptionTypeBase)
          )}
          value={
            testResult ? { value: testResult, label: full[testResult] } : null
          }
          placeholder="Your test result"
          // @ts-ignore
          onChange={(opt: OptionTypeBase) => {
            dispatch(setTestResult(opt.value as TestResult));
          }}
        />

        <button>{remainingNum} quick questions left</button>
      </div>
      <div className="flex flex-col items-start justify-center">
        <Markdown source={description} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(TestResultQuestion as ComponentType);
