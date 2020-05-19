import React, { ComponentType } from "react";

import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";

import Link from "../Link";
import {
  QuestionProps,
  meetsRequirements,
  mapStateToProps,
  questionNames,
} from "./helpers";
import ResultsDisplay from "./ResultsDisplay";
import Loader from "../Loader";

import QuestionTitle from "./QuestionTitle";
import { TestRecord, TestType, TestResult } from "../../utils/test";
import { fullTestType } from "../../utils/prevalence";
import {
  setTestType,
  setTest,
  setTestDate,
  setState,
  setCounty,
  setTestResult,
} from "../../redux/actions";
import {
  stringArrayToOptionType,
  stringToOptionType,
} from "../../utils/question";

const testTypes: TestType[] = ["Serology", "Molecular"];
const testResults: TestResult[] = ["Negative", "Positive"];

const InfoColumns: React.SFC<QuestionProps> = (props) => {
  if (!meetsRequirements(props)) {
    return null;
  }

  const {
    questionName,
    testType,
    test,
    testDate,
    location,
    tests,
    close,
    dispatch,
    countyOptions,
    stateOptions,
    testResult,
    stateCorrections,
    prevalenceMultiples,
  } = props;

  let content;

  switch (questionName) {
    case "intro": {
      content = (
        <div className="max-w-3xl self-center">
          <p className="mt-8">
            The accuracy of your test result is a function not only of the
            test's inherent{" "}
            <Link href="https://www.wikiwand.com/en/Sensitivity_and_specificity">
              "sensitivity" and "specificity"
            </Link>
            , but also of your prior likelihood to be positive or negative.
          </p>
          <p className="mb-8">
            Using estimated Covid prevalence in your area as a proxy for prior,
            this tool aims to help you understand the likelihood that your test
            result is accurate
          </p>
          <div>
            <button
              className="intro mt-2 py-1 px-2 text-sm rounded-full text-white"
              onClick={() => close("intro")}
            >
              Get started
            </button>
          </div>
        </div>
      );
      break;
    }
    case "testType": {
      content = (
        <>
          <Select
            className="select"
            placeholder="Antibody or Active Infection"
            value={
              testType
                ? { value: testType, label: fullTestType(testType) }
                : null
            }
            // @ts-ignore
            onChange={(opt: OptionTypeBase) => {
              if (testType !== opt.value) {
                dispatch(setTestType(opt.value));
              }
              close("testType");
            }}
            options={testTypes.map((opt) => ({
              value: opt,
              label: fullTestType(opt),
            }))}
          />
        </>
      );
      break;
    }
    case "test": {
      content = (
        <Select
          className="select"
          placeholder="Name of diagnostic test"
          value={test ? { value: test, label: test.diagnostic } : null}
          // @ts-ignore
          onChange={(opt: OptionTypeBase) => {
            dispatch(setTest(opt.value as TestRecord));
            close("test");
          }}
          options={(tests as TestRecord[])
            .filter((t) => t.type === testType)
            .map((test) => ({
              value: test,
              label: test.diagnostic,
            }))}
        />
      );
      break;
    }
    case "testDate": {
      const today = new Date();
      content = (
        <DatePicker
          className="w-40 p-1 rounded-md my-4"
          selected={testDate}
          onChange={(date: Date) => {
            dispatch(setTestDate(date));
          }}
          maxDate={today}
        />
      );
      break;
    }
    case "location": {
      content = stateOptions ? (
        <div className="flex lg:flex-row flex-col question__multi">
          <div className="flex flex-1">
            <Select
              className="select"
              options={stringArrayToOptionType(stateOptions)}
              value={location.state ? stringToOptionType(location.state) : null}
              placeholder="State"
              isSearchable
              onChange={(opt: OptionTypeBase) => {
                dispatch(setState(opt.value));
                dispatch(setCounty(undefined));
              }}
            />
          </div>
          {location.state && countyOptions ? (
            <div className="flex flex-1">
              <Select
                className="select"
                options={stringArrayToOptionType(countyOptions)}
                placeholder="County"
                value={
                  location.county ? stringToOptionType(location.county) : null
                }
                isSearchable
                onChange={(opt: OptionTypeBase) => {
                  dispatch(setCounty(opt.value));
                }}
              />
            </div>
          ) : null}
        </div>
      ) : (
        <Loader />
      );
      break;
    }
    case "testResult": {
      const fullResults: { [key in TestResult]: string } = {
        Positive: `Positive (showing ${
          testType === "Serology" ? "antibodies" : "infection"
        })`,
        Negative: `Negative or indeterminate (not showing ${
          testType === "Serology" ? "antibodies" : "infection"
        })`,
      };
      const fullResult = (type: TestResult) => fullResults[type];

      content = (
        <Select
          className="select"
          options={testResults.map(
            (r: TestResult) =>
              ({ value: r, label: fullResult(r) } as OptionTypeBase)
          )}
          value={
            testResult
              ? { value: testResult, label: fullResult(testResult) }
              : null
          }
          placeholder="Your test result"
          // @ts-ignore
          onChange={(opt: OptionTypeBase) => {
            dispatch(setTestResult(opt.value as TestResult));
          }}
        />
      );
      break;
    }
    case "display": {
      content =
        stateCorrections && prevalenceMultiples ? (
          <ResultsDisplay />
        ) : (
          <Loader />
        );
    }
  }

  const numLeft = questionNames.length - questionNames.indexOf(questionName);
  return (
    <div className="flex flex-col question">
      <QuestionTitle {...props} />
      {content}

      {["intro", "display"].includes(questionName) ? null : (
        <div>
          <button className="mt-4 py-1 px-2 text-sm rounded-full text-white">
            {numLeft === 1
              ? "Last question"
              : `${numLeft - 1} more quick question${numLeft === 2 ? "" : "s"}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default connect(mapStateToProps)(InfoColumns as ComponentType);
