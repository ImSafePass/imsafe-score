import React, { ComponentType } from "react";
import Select, { OptionTypeBase } from "react-select";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import queryString from "query-string";

import { setTest } from "../../redux/actions";
import { BaseQuestionProps } from "../../utils/question";
import { TestType, TestRecord } from "../../utils/test";
import { fullTestType } from "../../utils/prevalence";
import { ReduxState } from "../../redux/reducer";

import { makeOpener, Unimportant as U } from "./common";

interface Props extends BaseQuestionProps {
  test?: TestRecord;
  tests?: TestRecord[];
}

const mapStateToProps = (state: ReduxState) => ({
  test: state.test,
  tests: state.tests,
});

const TestQuestion: React.SFC<Props> = ({
  remainingNum,
  close,
  open,
  test,
  tests,
  dispatch,
}) => {
  const qs = queryString.parse(window.location.search);
  const testType = qs.type as TestType;

  const O = makeOpener(open);

  if (!tests || !tests.length) {
    return null;
  }

  const description =
    testType === "Serology"
      ? `A blood (**serology**) test gauges antibody levels which show that your body has responded to a COVID-19 infection.`
      : `A swab, spit, or breath condensate (** molecular **) test looks to confirm an active infection.`;

  return (
    <div className="question flex flex-row">
      <div className="flex flex-col items-start justify-center">
        <h3 className="question__question">
          What test kit was used
          <U> for your </U>
          <O name="testType">{fullTestType(testType).toLowerCase()}</O>
          <U> test?</U>
        </h3>
        <Select
          className="select"
          placeholder="Name of diagnostic test"
          value={test ? { value: test, label: test.diagnostic } : null}
          // @ts-ignore
          onChange={(opt: OptionTypeBase) => {
            dispatch(setTest(opt.value as TestRecord));
            close("test");
          }}
          options={tests.map((test) => ({
            value: test,
            label: test.diagnostic,
          }))}
        />
        <button>{remainingNum} quick questions left</button>
      </div>
      <div className="flex flex-col items-start justify-center">
        <Markdown source={description} />
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(TestQuestion as ComponentType);
