import React, { ComponentType } from "react";
import { connect } from "react-redux";

import {
  makeOpener,
  QuestionProps,
  meetsRequirements,
  Unimportant as U,
  mapStateToProps,
} from "./helpers";
import { fullTestType } from "../../utils/prevalence";
import { TestType, TestRecord } from "../../utils/test";
import { spelledWithYear } from "../../utils/date";

const QuestionTitle: React.SFC<QuestionProps> = (props) => {
  if (!meetsRequirements(props)) {
    return null;
  }

  const {
    questionName,
    testType,
    test,
    testDate,
    location,
    open,
    testResult,
  } = props;

  if (questionName === "intro") {
    return <h2 className="self-center">About this tool</h2>;
  }

  if (questionName === "testType") {
    return (
      <h3 className="question__question">What type of test did you take?</h3>
    );
  }

  const O = makeOpener(open);

  const testTypeEl = (
    <O name="testType">{fullTestType(testType as TestType).toLowerCase()}</O>
  );

  if (questionName === "test") {
    return (
      <h3 className="question__question">
        What test kit was used
        <U> for your </U>
        {testTypeEl}
        <U> test?</U>
      </h3>
    );
  }

  const manufacturerEl = <O name="test">{(test as TestRecord).manufacturer}</O>;
  const diagnosticEl = <O name="test">{(test as TestRecord).diagnostic}</O>;

  if (questionName === "testDate") {
    return (
      <h3 className="question__question">
        <U>You took a </U>
        {testTypeEl}
        <U> diagnostic from </U>
        {manufacturerEl}
        <U> known as "</U>
        {diagnosticEl}
        <U>".</U>
        <br />
        <span className="block mt-4 mb-2">When was your test taken?</span>
      </h3>
    );
  }

  const testDateEl = <O name="testDate">{spelledWithYear(testDate)}</O>;

  if (questionName === "location") {
    return (
      <h3 className="question__question">
        <U>On </U>
        {testDateEl}
        <U> you took a </U>
        {testTypeEl}
        <U> diagnostic from </U>
        {manufacturerEl}
        <U> known as "</U>
        {diagnosticEl}
        <U>". </U>
        <br />
        <span className="my-2 block">
          Where was your test administered (or where have you been most in the
          last month)?
        </span>
      </h3>
    );
  }

  const locationEl = (
    <O name="location">
      <>
        {location.county}, {location.state}
      </>
    </O>
  );

  const allButResultEl = (
    <>
      {" "}
      <U>On </U>
      {testDateEl}
      <U> in </U>
      {locationEl}
      <U> you took a </U>
      {testTypeEl}
      <U> diagnostic from </U>
      {manufacturerEl}
      <U> known as "</U>
      {diagnosticEl}
      <U>". </U>
    </>
  );

  if (questionName === "testResult") {
    return (
      <h3 className="question__question">
        {allButResultEl}
        <br />
        <span className="block mt-4 mb-2">What was your test result?</span>
      </h3>
    );
  }

  return (
    <h3 className="question__question mt-8">
      {allButResultEl}
      <br />
      <U>Your result was '</U>
      <O name="testResult">{(testResult as string).toLocaleLowerCase()}</O>
      <U>'.</U>
    </h3>
  );
};

export default connect(mapStateToProps)(QuestionTitle as ComponentType);
