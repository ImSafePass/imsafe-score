import React, { ComponentType } from "react";
import Select, { OptionTypeBase } from "react-select";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import queryString from "query-string";

import { setState, setCounty } from "../../redux/actions";
import {
  BaseQuestionProps,
  stringArrayToOptionType,
  stringToOptionType,
} from "../../utils/question";
import { TestType, TestRecord } from "../../utils/test";
import { fullTestType } from "../../utils/prevalence";
import { ReduxState, LocationState } from "../../redux/reducer";
import { spelled } from "../../utils/date";

import { makeOpener, Unimportant as U } from "./common";

interface Props extends BaseQuestionProps {
  location: LocationState;
  testDate?: Date;
  test: TestRecord;
  countyOptions: string[];
  stateOptions: string[];
}

const mapStateToProps = (state: ReduxState) => {
  const nyt = state.nyt || {};

  return {
    location: state.location,
    testDate: state.testDate,
    test: state.test as TestRecord,
    stateOptions: nyt ? Object.keys(nyt).sort() : [],
    countyOptions:
      state.location.state && nyt
        ? Object.keys(nyt[state.location.state]).sort()
        : undefined,
  };
};

const LocationQuestion: React.SFC<Props> = ({
  remainingNum,
  close,
  open,
  testDate,
  location,
  test,
  dispatch,
  stateOptions,
  countyOptions,
}) => {
  const qs = queryString.parse(window.location.search);
  const testType = qs.type as TestType;

  const O = makeOpener(open);

  if (!testDate) {
    return null;
  }

  const description = `
    On April 12, 2020 prevalence of COVID19 antibodies varied widely in the United States, but our estimates put it between 1.72% and 7.52% nationally.
  `;

  return (
    <div className="question flex flex-row">
      <div className="flex flex-col items-start justify-center">
        <h3 className="question__question">
          On <O name="testDate">{spelled(testDate)}</O>
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
        <div className="flex flex-row question__multi">
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

        <button>{remainingNum} quick questions left</button>
      </div>
      <div className="flex flex-col items-start justify-center">
        <Markdown source={description} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(LocationQuestion as ComponentType);
