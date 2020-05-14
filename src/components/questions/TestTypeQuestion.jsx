import React from "react";
import Select from "react-select";
import Markdown from "react-markdown";
import { connect } from "react-redux";
import queryString from "query-string";

import { setTestType } from "../../redux/actions";
import { fullTestType } from "../../utils/prevalence";

const description = `
A blood (**serology**) test gauges antibody levels which show that your body has responded to a COVID-19 infection.
A swab, spit, or breath condensate (**molecular**) test looks to confirm an active infection.
`;

const options = ["Serology", "Molecular"];

const TestTypeQuestion = ({ remainingNum, close, open, dispatch }) => {
  const qs = queryString.parse(window.location.search);
  const testType = qs.type;

  return (
    <div className="question flex flex-row">
      <div className="flex flex-col items-start justify-center">
        <h3 className="question__question">What type of test did you take?</h3>
        <Select
          className="select"
          placeholder="Antibody or Active Infection"
          value={
            testType ? { value: testType, label: fullTestType(testType) } : null
          }
          // @ts-ignore
          onChange={(opt) => {
            dispatch(setTestType(opt.value));
            close("testType");
          }}
          options={options.map((opt) => ({
            value: opt,
            label: fullTestType(opt),
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

export default connect()(TestTypeQuestion);
