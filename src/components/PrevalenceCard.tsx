import React from "react";
import { connect } from "react-redux";

import Link from "./Link";
import { LocationState, ReduxState } from "../redux/reducer";
import { TestRecord } from "../utils/test";
import {
  getPrevalenceFromState,
  Prevalence,
  fullTestType,
  activeInfectionLengthDays,
} from "../utils/prevalence";

interface Props {
  location: LocationState;
  prevalence: Prevalence;
  testDate: Date;
  test: TestRecord;
}

const mapStateToProps = (state: ReduxState) => ({
  prevalence: getPrevalenceFromState(state),
  location: state.location as LocationState,
  testDate: state.testDate as Date,
  test: state.test as TestRecord,
});

const PrevalenceCard = ({ location, prevalence, test }: Props) => {
  const testDateExplainer =
    test.type === "Serology"
      ? `total number of cases existant prior to your earliest date of likely infection.`
      : `number of cases which are presumed active during the likely date of infection.`;

  const caseType =
    test.type === "Serology" ? "recovered cases" : "active cases";

  return (
    <div className="card">
      <p>
        <Link href="https://www.mathsisfun.com/data/bayes-theorem.html">
          Bayes Theorem
        </Link>{" "}
        stiuplates that the "accuracy" of any test result is a function both of
        the diagnostic's{" "}
        <Link href="https://www.wikiwand.com/en/Sensitivity_and_specificity">
          "sensitivity" and "specificity"
        </Link>{" "}
        and your "prior probability" of being infected: The likelihood that you
        are infected <em>before</em> you receive the test result.
      </p>
      <p>
        In other words, even if a test is highly sensitive and specific, a
        positive result is likely to be a "false positive" if the condition for
        which it is testing is extremely rare. Likewise, a negative is more
        likely to be a "false negative" if the condition is extremely common
        than if the condition is extremely rare.
      </p>
      <p>
        We attempt to calculate a reasonable "prior probability" based on
        prevalence of Covid within your area. "Real" prevalence is not just
        known cases, but also the total number of <em>unknown</em> cases of
        which known cases are a subset.
      </p>
      <p>
        "Real" prevalence of Covid within the general population remains -- and
        will always remain -- unknown, but models for predicting it based on
        known cases are improving. The below estimates use publicly reported
        cases, and attempt to correct for state-by-state variance in testing
        practices.
      </p>
      <p>
        Our estimates of prevalence are based on the number if{" "}
        <em>known and likely active</em> cases in {location.county},{" "}
        {location.state} when you were most likely to be infected. For a{" "}
        {fullTestType(test.type)} test, like the one you took, that number is
        the {testDateExplainer} We calculate this using the estimated average
        length of infection ({activeInfectionLengthDays} days).
      </p>
      <p>
        We attempt to correct for state variance in measurement, and apply a
        multiple to estimate "real"/"total" cases from know cases in your area.
        Using this method, we estimate there to have been{" "}
        {prevalence.relevantRawCases} {caseType} on the relevant date.
      </p>
      <p>
        That represents {Math.round(prevalence.estimatedCaseObject.mid)}{" "}
        "real"/"total" {caseType}, or{" "}
        {(
          (prevalence.estimatedCaseObject.mid / prevalence.basePopulation) *
          100
        ).toFixed(2)}
        % of the local population. This estimate is based on a prevalence
        multiple, and represents a midpoint between estimated low and high
        prevalence of {Math.round(prevalence.estimatedCaseObject.low)} (
        {(
          (prevalence.estimatedCaseObject.low / prevalence.basePopulation) *
          100
        ).toFixed(2)}
        % ) and {Math.round(prevalence.estimatedCaseObject.high)} (
        {(
          (prevalence.estimatedCaseObject.high / prevalence.basePopulation) *
          100
        ).toFixed(2)}
        % ).
      </p>
    </div>
  );
};

export default connect(mapStateToProps)(PrevalenceCard);
