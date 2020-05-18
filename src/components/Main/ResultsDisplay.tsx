import React, { ComponentType } from "react";
import { connect } from "react-redux";
import numeral from "numeral";

import { ReactComponent as Person } from "../../assets/person.svg";
import { QuestionProps, mapStateToProps } from "./helpers";
import { TestResult, TestRecord, TestType } from "../../utils/test";
import bayesResults from "../../utils/bayes";
import { LowMidHigh } from "../../redux/reducer";
import {
  fullTestType,
  activeInfectionLengthDays,
  antibodyDelayDays,
} from "../../utils/prevalence";
import ResultsChart from "../ResultsChartSvg";

const ResultsDisplay: React.SFC<QuestionProps> = ({
  testType,
  prevalence,
  test,
  testResult,
  location,
}) => {
  const results = bayesResults(
    prevalence,
    test as TestRecord,
    testResult as TestResult
  );
  const { before, after } = results;

  const cases = (key: LowMidHigh) =>
    Math.round(prevalence.estimatedCaseObject[key] || 0);
  const caseString = (key: LowMidHigh) => numeral(cases(key)).format("0,0");
  const percent = (key: LowMidHigh) => cases(key) / prevalence.basePopulation;
  const percentString = (key: LowMidHigh) => percent(key).toFixed(2);

  const falseRate = Math.round(100 - percent("mid"));

  const caseName =
    (testType as TestType) === "Molecular" ? "active cases" : "recovered cases";

  const locationDateP = (
    <p>
      Our estimates of prevalence are based on the number if known and likely{" "}
      {caseName} in{" "}
      <strong>
        {location.county}, {location.state}
      </strong>{" "}
      when you were most likely to be infected. For a{" "}
      {fullTestType(testType as TestType)} test, like the one you took, that
      number is the{" "}
      {testType === "Molecular"
        ? `number of cases which are presumed active during the
      likely date of infection. We calculate this using an estimated average
      length of infection of ${activeInfectionLengthDays} days.`
        : `number of cumulative cases which are likely to have recovered by your date of testing. We calculate this using an estimated number of ${antibodyDelayDays} days before recovery.`}
    </p>
  );

  const testMeasureSourceText = test?.fdaApprovalDate
    ? `This is an FDA-authorized test with a stated accuracy of`
    : `This test has a stated accuracy (${test?.chosenTestEntity} measure) of`;

  const testAccuracyText = `${(test?.sensitivity.mid as number).toFixed(
    2
  )} sensitivity and ${(test?.specificity.mid as number).toFixed(
    2
  )}% specificity`;

  return (
    <>
      <div className="card my-8" style={{ paddingLeft: 30, paddingRight: 30 }}>
        <h4 className="my-2">
          Chance that you{" "}
          {testType === "Serology"
            ? "have antibodies for COVID-19"
            : "have active COVID-19 infection"}
          .
        </h4>
        <ResultsChart before={before} after={after} />
      </div>

      <div className="flex lg:flex-row flex-col mb-10">
        <div className="flex flex-col lg:w-2/3 w-full lg:pr-8 pr-0">
          <p>
            Bayes Theorem stipulates that the "accuracy" of any test result is a
            function both of the diagnostic's "sensitivity" and "specificity"
            and your "prior probability" of being infected: The likelihood that
            you are infected before you receive the test result.
          </p>
          <p>
            Even if a test is highly sensitive and specific, a positive result
            would likely be a "false positive" if the condition for which it is
            testing is extremely rare. Likewise, a negative is more likely to be
            a "false negative" if the condition is extremely common than if the
            condition is extremely rare.
          </p>
          <p>
            You took{" "}
            <strong>
              {test?.diagnostic} by {test?.manufacturer}
            </strong>
            . {testMeasureSourceText} {testAccuracyText}. Your likelihood of a
            true {testResult?.toLocaleLowerCase()} also depends on your prior
            probability of infection.
          </p>
          <h5 className="my-4">Prior Probability</h5>
          <p>
            This tool uses an estimate of Covid prevalence in your area as a
            proxy for "prior probability". This prevalence is an estimate not
            just of known cases, but also of the total number of unknown cases
            of which known cases are a subset.
          </p>
          <p>
            Such "real" remains -- and will always remain -- unknown, but models
            for predicting it based on known cases are improving. The below
            estimates use publicly reported cases, and apply a midrange in a set
            of public prevalence models.
          </p>
          <h5 className="my-4">Local Prevalence</h5>
          {locationDateP}
          <p>
            We attempt to correct for state variance in measurement, and apply a
            multiple to estimate "real"/"total" cases from know cases in your
            area. Using this method, we estimate there to have been{" "}
            <strong>{caseString("mid")}</strong> {caseName} on the relevant
            date.
          </p>
          <p>
            This {caseString("mid")} "real"/"total" {caseName} represents
            roughly or <strong>{percentString("mid")}%</strong> of the local
            population. This estimate is based on a prevalence multiple, and
            represents a midpoint between estimated low and high prevalence of{" "}
            {caseString("low")} ({percentString("low")}%) and{" "}
            {caseString("high")} ({percentString("high")}%).
          </p>
        </div>
        <div className="flex flex-col lg:w-1/3 w-full justify-start">
          <div className="card mb-8">
            <p>
              All tests have the potential for error. Given test kit
              characteristics and the prevalence in your area, we would expect a{" "}
              <em>"false {testResult?.toLocaleLowerCase()}" error</em> for{" "}
              <strong>{falseRate}%</strong> of those who received a{" "}
              {testResult?.toLocaleLowerCase()} result.
            </p>
            {false ? (
              <div className="my-4 mx-2">
                {new Array(10).fill("").map((row, rowInd) => (
                  <div
                    className="row flex flex-row justify-between"
                    style={{ marginBottom: 5 }}
                    key={`row-${rowInd}`}
                  >
                    {new Array(10).fill("").map((person, personInd) => (
                      <div
                        className="person bg-white rounded-full flex items-center justify-center"
                        style={{ width: 22, height: 22 }}
                        key={`person=${rowInd}${personInd}`}
                      >
                        <Person width={18} height={18} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(mapStateToProps)(ResultsDisplay as ComponentType);
