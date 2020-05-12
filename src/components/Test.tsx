import React, { ComponentType, useState, useEffect } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";
import queryString from "query-string";

import "react-datepicker/dist/react-datepicker.css";

import { ReduxState } from "../redux/reducer";

import { TestOption, TestRecord, TestResult } from "../utils/test";
import { NytObject } from "../utils/nyt";
import { LocationState } from "../redux/reducer";

import PrevalenceCard from "./PrevalenceCard";
import SpecificitySensitivityCard from "./SpecificitySensitivityCard";
import ResultsCard from "./ResultsCard";
import Question from "./Question";

import {
  setTestDate,
  setTest,
  setState,
  setCounty,
  setTestResult,
} from "../redux/actions";
import { updateSearch } from "../utils/url";
import { brief, spelled } from "../utils/date";
import get from "lodash.get";

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

  (state.tests || []).forEach((test) => {
    if (!testTypeObj[test.type]) {
      testTypeObj[test.type] = true;
    }
  });

  const testTypes = Object.keys(testTypeObj);

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
    testTypes,
    location,
  };
};

const stringToOptionType = (string: string): OptionTypeBase => ({
  label: string,
  value: string,
});

const stringArrayToOptionType = (stringArray: string[]): OptionTypeBase[] =>
  stringArray.map(stringToOptionType);

const Test = ({
  stateOptions,
  countyOptions,
  testDate,
  test,
  location,
  dispatch,
  testTypes,
  testResults,
  testResult,
  tests,
}: Props) => {
  const qs = queryString.parse(window.location.search);
  const [open, setOpen] = useState<{ [key: string]: boolean }>({
    testType: !qs.type,
    test: !test,
    testDate: !testDate,
    location: !(location.state && location.county),
    testResult: !testResult,
  });

  const toggleOpen = (questionName: string) => {
    setOpen({ ...open, [questionName]: !open[questionName] });
  };

  const toggle = (questionName: string) => () => toggleOpen(questionName);

  const today = new Date();

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
      <Question
        question="What type of test did you take?"
        answer={`You took a *${(
          (qs.type as string) || ""
        ).toLowerCase()}* test.`}
        onAnswerClick={toggle("testType")}
        open={open.testType}
        visible
      >
        <Select
          className="select"
          placeholder="Test name"
          value={qs.type && stringToOptionType(qs.type as string)}
          onChange={(opt: OptionTypeBase) => {
            updateSearch({ type: opt.value, test: null });
            dispatch(setTest(undefined));
            toggleOpen("testType");
          }}
          options={stringArrayToOptionType(testTypes)}
        />
      </Question>
      <Question
        visible={!!qs.type}
        question={`Which ${(
          (qs.type as string) || ""
        ).toLowerCase()} test did you take?`}
        answer={`You took *${get(test, "diagnostic")}*.`}
        onAnswerClick={toggle("test")}
        open={open.test}
      >
        <Select
          className="select"
          placeholder="Test name"
          value={test && { value: test, label: test.diagnostic }}
          // @ts-ignore
          onChange={(opt: TestOption) => {
            updateSearch({ test: opt.value.id });
            dispatch(setTest(opt.value));
          }}
          options={tests
            .filter((test) => test.type === qs.type)
            .map((t) => ({ value: t, label: t.diagnostic }))}
        />
      </Question>

      {/* Show specificity and sensitivity information */}
      {/* {test ? <SpecificitySensitivityCard /> : null} */}

      <Question
        visible={!!test}
        question="When were you tested?"
        answer={`You were tested on *${testDate && spelled(testDate)}*.`}
        onAnswerClick={toggle("testDate")}
        open={open.testDate}
      >
        <DatePicker
          className="w-40 p-1 rounded-md my-4"
          selected={testDate}
          onChange={(date: Date) => {
            updateSearch({ date: brief(date) });
            dispatch(setTestDate(date));
          }}
          maxDate={today}
        />
      </Question>

      <Question
        visible={!!(qs.type && test && testDate)}
        question="Where are you located?"
        answer={`You're in *${location.county}, ${location.state}*.`}
        onAnswerClick={toggle("location")}
        open={open.location}
      >
        <div className="flex flex-col items-center md:flex-row">
          <div className="md:mr-10 flex flex-1 w-full">
            <Select
              className="select"
              options={stringArrayToOptionType(stateOptions)}
              value={location.state && stringToOptionType(location.state)}
              placeholder="State"
              isSearchable
              onChange={(opt: OptionTypeBase) => {
                updateSearch({ state: opt.value, county: null });
                dispatch(setState(opt.value));
                dispatch(setCounty(undefined));
              }}
            />
          </div>

          {location.state && countyOptions ? (
            <div className="flex flex-1 w-full">
              <Select
                className="select"
                options={stringArrayToOptionType(countyOptions)}
                placeholder="County"
                value={location.county && stringToOptionType(location.county)}
                isSearchable
                onChange={(opt: OptionTypeBase) => {
                  updateSearch({ county: opt.value });
                  dispatch(setCounty(opt.value));
                }}
              />
            </div>
          ) : null}
        </div>
      </Question>

      {/* Display prevalence information */}
      {location.state && location.county && testDate && test ? (
        <PrevalenceCard />
      ) : null}

      {/* Allow user to request results */}
      <Question
        visible={!!(location.state && location.county && testDate && test)}
        question="What was your test result?"
        answer={`You tested *${testResult}*.`}
        onAnswerClick={toggle("testResult")}
        open={open.testResult}
      >
        <Select
          className="select"
          placeholder="Test name"
          value={stringToOptionType(testResult)}
          onChange={(opt: OptionTypeBase) => {
            updateSearch({ result: opt.value });
            dispatch(setTestResult(opt.value));
          }}
          options={stringArrayToOptionType(testResults)}
        />
      </Question>
      {/* Show full results */}
      {testResult && test && location.state && location.county ? (
        <ResultsCard />
      ) : null}
    </div>
  );
};

export default connect(mapStateToProps)(Test as ComponentType);
