import React, { ReactElement } from "react";
import { connect } from "react-redux";

import { ReduxState, LowMidHigh } from "../redux/reducer";
import { TestRecord, TestResult } from "../utils/test";
import {
  getPrevalenceFromState,
  Prevalence,
  fullTestType,
} from "../utils/prevalence";

import Link from "./Link";
import Loader from "./Loader";
import ResultsChart from "./ResultsChartSvg";
import bayesResults from "../utils/bayes";

interface Props {
  prevalence?: Prevalence;
  test: TestRecord;
  testResult: TestResult;
}

const mapStateToProps = (state: ReduxState) => ({
  prevalence: getPrevalenceFromState(state),
  testResult: state.testResult as TestResult,
  test: state.test as TestRecord,
});

const ResultsCard = ({ prevalence, testResult, test }: Props) => {
  if (!prevalence || !test || !testResult) {
    return (
      <div className="card">
        <Loader />
      </div>
    );
  }

  const res = testResult.toLowerCase();

  const results = bayesResults(prevalence, test, testResult);
  const { before, after } = results;

  const populationPercent =
    prevalence.estimatedCaseObject.mid ** prevalence.basePopulation;

  return (
    <div className="card">
      <h4 className="mb-4">Result Accuracy</h4>
      <p>
        The likelihood of your {res} test result being a "true", rather than a
        "false" {res} depends both on your "prior likelihood" of infection and
        on the specificity and sensitivity of your test. This calculation is
        called Bayes Theorem.
      </p>
      <p>
        In this context,{" "}
        <Link href="https://plato.stanford.edu/entries/bayes-theorem/">
          Bayes Theorem
        </Link>{" "}
        asserts that the probability of you being a "true" {res}, given your{" "}
        {res} test result, is defined as the probability that you would test{" "}
        {res} if you were truly {res}, multiplied by your prior probability of
        truly being {res}, all divided by your estimated probability of testing{" "}
        {res} given no testing information.
      </p>
      <p>
        You took the {test.diagnostic} {fullTestType(test.type)} diagnostic, by{" "}
        {test.manufacturer}, and we estimated area on the relevant dates to be{" "}
        {(populationPercent * 100).toFixed(2)}% of your local popluation.
      </p>
      <p>
        Using this prevalence as your "prior probability" and plugging the
        sensitivity and specificity of your test in, we estimate there to be a{" "}
        {(after.mid * 100).toFixed(2)}% chance that your {res} result is a
        "true" {res}, and, conversely, a {((1 - after.mid) * 100).toFixed(2)}%
        chance that it is a "false" {res}.
      </p>
      {/* <ResultsChart
        bars={[
          {
            data: before,
            label: "Before Test",
          },
          {
            data: after,
            label: "After Test",
          },
        ]}
      /> */}
    </div>
  );
};

export default connect(mapStateToProps)(ResultsCard);
