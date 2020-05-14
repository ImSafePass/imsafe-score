import React, { ComponentType } from "react";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import queryString from "query-string";
import DatePicker from "react-datepicker";

import { setTestDate } from "../../redux/actions";
import { BaseQuestionProps } from "../../utils/question";
import { TestType, TestRecord } from "../../utils/test";
import { fullTestType } from "../../utils/prevalence";
import { ReduxState } from "../../redux/reducer";

import { makeOpener, Unimportant as U } from "./common";

interface Props extends BaseQuestionProps {
  test: TestRecord;
  testDate: Date;
}

const mapStateToProps = (state: ReduxState) => ({
  test: state.test as TestRecord,
  testDate: state.testDate,
});

const TestDateQuestion: React.SFC<Props> = ({
  remainingNum,
  close,
  open,
  test,
  testDate,
  dispatch,
}) => {
  const qs = queryString.parse(window.location.search);
  const testType = qs.type as TestType;
  const today = new Date();
  const O = makeOpener(open);

  const description = `
    This is an FDA-authorized test with a stated accuracy of 97% sensitivity and 98% specificity.

    It is the 3rd most accurate test we are aware of currently in the US market.
  `;

  return (
    <div className="question flex flex-row">
      <div className="flex flex-col items-start justify-center">
        <h3 className="question__question">
          <U>You took a </U>
          <O name="testType">{fullTestType(testType).toLowerCase()}</O>
          <U> diagnostic from </U>
          <O name="test">{test.manufacturer}</O>
          <U> known as "</U>
          <O name="test">{test.diagnostic}</O>
          <U>".</U>
          <br />
          When was your test taken?
        </h3>
        <DatePicker
          className="w-40 p-1 rounded-md my-4"
          selected={testDate}
          onChange={(date: Date) => {
            dispatch(setTestDate(date));
          }}
          maxDate={today}
        />
        <button>{remainingNum} quick questions left</button>
      </div>
      <div className="flex flex-col items-start justify-center">
        <Markdown source={description} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(TestDateQuestion as ComponentType);
