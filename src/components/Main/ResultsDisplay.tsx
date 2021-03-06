import React, { ComponentType, useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import numeral from "numeral";

import { asPercent } from "../../utils/number";
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

const ResultsDisplay: React.SFC<QuestionProps> = (props) => {
  const { prevalence, location, testDate } = props;
  const test = props.test as TestRecord;
  const testResult = props.testResult as TestResult;
  const testType = props.testType as TestType;

  const [resultsSaved, setResultsSaved] = useState(false);
  const [circleWidth, setCircleWidth] = useState(22);
  const circleContainer = useRef(null);

  const results = bayesResults(prevalence, test, testResult);
  let { before, after } = results;

  const roundRate = Math.round(after.mid * 100);
  const falseRate = Math.round(100 - roundRate);

  // Reverse charts for negative results
  if (testResult === "Negative") {
    before = {
      low: 1 - before.low,
      mid: 1 - before.mid,
      high: 1 - before.high,
    };
    after = {
      low: after.low && 1 - after.low,
      mid: 1 - after.mid,
      high: after.high && 1 - after.high,
    };
  }

  const cases = (key: LowMidHigh) =>
    Math.round(prevalence.estimatedCaseObject[key] || 0);
  const caseString = (key: LowMidHigh) => numeral(cases(key)).format("0,0");
  const percent = (key: LowMidHigh) =>
    (cases(key) / prevalence.basePopulation) * 100;
  const percentString = (key: LowMidHigh) => asPercent(percent(key));

  const people = new Array(10)
    .fill("")
    .map((r, rowInd) =>
      new Array(10)
        .fill("")
        .map((p, ind) => (rowInd * 10 + ind < roundRate ? true : false))
    );

  const caseName =
    (testType as TestType) === "Molecular" ? "active cases" : "recovered cases";

  useEffect(() => {
    const dynamoUrl =
      "https://cn8r6588a8.execute-api.us-east-1.amazonaws.com/default/bayes-dynamo";

    if (!resultsSaved) {
      const local = window.location.href.includes("localhost");
      const data = {
        testId: { S: test.id },
        testName: { S: test.diagnostic },
        testType: { S: test.type },
        testManufacturer: { S: test.manufacturer },
        state: { S: location.state },
        county: { S: location.county },
        testResult: { S: testResult },
        testDate: { S: testDate },
        local: { BOOL: local },
      };

      setResultsSaved(true);

      if (local) {
        console.log("TRACKING SUBMISSION", data);
      } else {
        fetch(dynamoUrl, {
          method: "POST",
          body: JSON.stringify(data),
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error(err, data);
          });
      }
    }

    if (circleContainer && circleContainer.current) {
      const calculateCircleWidth = () => {
        const node = (circleContainer.current as unknown) as HTMLElement;
        const rect = node.getBoundingClientRect();
        if (rect) {
          const nodeWidth =
            rect.width -
            2 *
              parseInt(
                window.getComputedStyle(node, null).getPropertyValue("padding")
              );
          setCircleWidth(nodeWidth / (10 + 9 / 3)); // Each divider is a third the width of a circle
        } else {
          console.error("No rect", node, circleContainer);
        }
      };
      calculateCircleWidth();
      window.addEventListener("resize", calculateCircleWidth);
    }
  }, [
    circleContainer,
    resultsSaved,
    test,
    location.state,
    location.county,
    testDate,
    testResult,
  ]);

  const locationDateP = (
    <p>
      Our estimates of prevalence are based on the number of known and likely{" "}
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

  const testMeasureSourceText = test.fdaApprovalDate
    ? `This is an FDA-authorized test with a stated accuracy of`
    : `This test has a stated accuracy (${test.chosenTestEntity} measure) of`;

  const measure = (
    key: "sensitivity" | "specificity",
    point: LowMidHigh = "mid"
  ) => {
    const score = test[key][point];
    if (score) {
      return asPercent(score);
    } else {
      return null;
    }
  };

  const fullMeasure = (key: "sensitivity" | "specificity") => {
    const hasCI = !!measure(key, "low");
    const isRounded = measure(key) === "100%";

    return `${measure(key)} ${key}${
      isRounded || hasCI
        ? ` (${
            hasCI
              ? `from ${measure(key, "low")}-${measure(
                  key,
                  "high"
                )} with 95% certainty`
              : ""
          }${hasCI && isRounded ? ", and " : ""}${
            isRounded ? "rounded to 99.99% for more realistic probability" : ""
          })`
        : ""
    }`;
  };

  const circleColor = testResult === "Positive" ? "bg-red" : "bg-teal";

  return (
    <>
      <div className="card my-8" style={{ paddingLeft: 30, paddingRight: 30 }}>
        <h4 className="my-2">
          Chance that you{" "}
          {testType === "Serology"
            ? "have antibodies for Covid-19"
            : "have active Covid-19 infection"}
          .
        </h4>
        <ResultsChart before={before} after={after} location={location} />
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
              {test.diagnostic} by {test.manufacturer}
            </strong>
            . {testMeasureSourceText}{" "}
            {`${[fullMeasure("sensitivity"), fullMeasure("specificity")].join(
              " and "
            )}`}
            .
          </p>
          <p>
            Your likelihood of a true {testResult?.toLocaleLowerCase()} also
            depends on your prior probability of infection.
          </p>
          <h5 className="my-4">Prior Probability</h5>
          <p>
            This tool uses an estimate of Covid prevalence in your area as a
            proxy for "prior probability". This prevalence is an estimate not
            just of known cases, but also of the total number of unknown cases
            of which known cases are a subset.
          </p>
          <p>
            Such "real" prevalence remains -- and will always remain -- unknown,
            but models for predicting it based on known cases are improving. The
            below estimates use publicly reported cases, and apply a midrange in
            a set of public prevalence models.
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
            roughly <strong>{percentString("mid")}</strong> of the local
            population. This estimate is based on a prevalence multiple, and
            represents a midpoint between estimated low and high prevalence of{" "}
            {caseString("low")} ({percentString("low")}) and{" "}
            {caseString("high")} ({percentString("high")}).
          </p>
        </div>

        <div className="flex flex-col lg:w-1/3 w-full justify-start lg:mt-0 mt-8">
          <div className="card mb-8">
            <p>All tests have the potential for error.</p>
            <p className="mb-4">
              Given test chracteristics and local prevalence, we suspect that
              for every 100 people who tested {testResult?.toLowerCase()} in
              your area, <strong>{falseRate}</strong> would be "false{" "}
              {testResult.toLowerCase()}s":
            </p>
            <div
              className="my-2 p-4 bg-white rounded-sm justify-center items-center"
              ref={circleContainer}
            >
              {people.map((row, rowInd) => (
                <div
                  className="flex flex-row justify-center"
                  style={{ marginBottom: rowInd === 9 ? 0 : circleWidth / 3 }}
                  key={`row-${rowInd}`}
                >
                  {row.map((person, personInd) => (
                    <div
                      className={`person rounded-full flex items-center justify-center ${
                        person ? `${circleColor}-500` : `${circleColor}-200`
                      }`}
                      style={{
                        width: circleWidth,
                        height: circleWidth,
                        marginRight: personInd === 9 ? 0 : circleWidth / 3,
                      }}
                      key={`person=${rowInd}${personInd}`}
                    >
                      {person ? (
                        <p className="flex self-center text-white">
                          {testResult === "Positive" ? "+" : "-"}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(mapStateToProps)(ResultsDisplay as ComponentType);
