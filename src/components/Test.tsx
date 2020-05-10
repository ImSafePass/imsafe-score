import React, { ComponentType } from "react";
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

import {
  setTestDate,
  setTest,
  setState,
  setCounty,
  setTestResult,
} from "../redux/actions";
import { updateSearch } from "../utils/url";
import { brief } from "../utils/date";

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

  const today = new Date();

  return (
    <div>
      <div className="mt-8">
        <h4>What type of test did you take?</h4>
        <Select
          className="w-40 p-1 rounded-md my-2"
          placeholder="Test name"
          value={qs.type && stringToOptionType(qs.type as string)}
          onChange={(opt: OptionTypeBase) => {
            updateSearch({ type: opt.value, test: null });
            dispatch(setTest(undefined));
          }}
          options={stringArrayToOptionType(testTypes)}
        />
      </div>
      {qs.type ? (
        <div className="mt-8">
          <h4>Which {(qs.type as string).toLowerCase()} test did you take?</h4>
          <Select
            className="w-40 p-1 rounded-md my-2"
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
        </div>
      ) : null}
      {/* Show specificity and sensitivity information */}
      {test ? <SpecificitySensitivityCard /> : null}
      {test ? (
        <div className="mt-8">
          <h4>When were you tested?</h4>
          <DatePicker
            className="w-40 p-1 rounded-md my-4"
            selected={testDate}
            onChange={(date: Date) => {
              updateSearch({ date: brief(date) });
              dispatch(setTestDate(date));
            }}
            maxDate={today}
          />
        </div>
      ) : null}

      {qs.type && test && testDate ? (
        <div className="my-4">
          <h4>Where are you located?</h4>
          <div className="flex flex-row items-center">
            <div className="w-40 mr-10 my-10">
              <Select
                className="my-2"
                options={stringArrayToOptionType(stateOptions)}
                name="state"
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
              <div className="w-40 mr-10">
                <Select
                  className="my-2"
                  options={stringArrayToOptionType(countyOptions)}
                  placeholder="County"
                  name="county"
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
        </div>
      ) : null}

      {/* Display prevalence information */}
      {location.state && location.county && testDate ? (
        <PrevalenceCard />
      ) : null}

      {/* Allow user to request results */}
      {location.state && location.county && testDate ? (
        <div className="mt-8">
          <h4>What was your test result?</h4>
          <Select
            className="w-40 p-1 rounded-md my-2"
            placeholder="Test name"
            value={stringToOptionType(testResult)}
            onChange={(opt: OptionTypeBase) => {
              updateSearch({ result: opt.value });
              dispatch(setTestResult(opt.value));
            }}
            options={stringArrayToOptionType(testResults)}
          />
        </div>
      ) : null}
      {/* Show full results */}
      {testResult ? <ResultsCard /> : null}
    </div>
  );
};

export default connect(mapStateToProps)(Test as ComponentType);
