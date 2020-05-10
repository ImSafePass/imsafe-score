import React from "react";
import { connect } from "react-redux";

import { TestRecord, SpecificityOrSensitivity } from "../utils/test";
import { spelled } from "../utils/date";

import Link from "./Link";
import { ReduxState } from "../redux/reducer";

interface Props {
  test: TestRecord;
}

const mapStateToProps = (state: ReduxState) => ({
  test: state.test as TestRecord,
});

const SensitivitySpecificityCard = ({ test }: Props) => {
  const {
    manufacturer,
    diagnostic,
    specificity,
    sensitivity,
    typeDetail,
    chosenTestEntity,
    fdaLink,
    fdaApprovalDate,
    documentLink,
    euaApproved,
  } = test;

  const measureHtml = (measure: SpecificityOrSensitivity) => (
    <>
      <strong>{measure.mid}%</strong>
      {measure.low
        ? ` (${measure.low}% to ${specificity.high}% with 95% confidence)`
        : ""}
    </>
  );

  return (
    <div className="card">
      <p className="mb-4">
        A diagnostic's accuracy is a function of its{" "}
        <Link href="https://www.wikiwand.com/en/Sensitivity_and_specificity">
          "sensitivity" and "specificity"
        </Link>{" "}
        -- essentially its ability to detect illness and to distinguish that
        illness from others, respectively.
      </p>
      <p className="mb-4">
        We have pulled sensitivity and specificity data from public sources,
        preferencing independent over manufacturer measures.
      </p>
      <p className="mb-4">
        This knowledge is imperfect, and where given, we've displayed the{" "}
        <Link href="https://www.wikiwand.com/en/Confidence_interval">
          "confidence interval"
        </Link>{" "}
        for the measured sensitivity and specificity of each test.
      </p>
      <p className="mb-4">
        The{" "}
        <strong>
          {manufacturer} {diagnostic} {typeDetail}
        </strong>{" "}
        has a sensitivity of {measureHtml(sensitivity)} and a specificify of{" "}
        {measureHtml(specificity)}, according to{" "}
        {chosenTestEntity === "manufacturer"
          ? "the manufacturer"
          : "independent assessment"}
        .
      </p>
      {euaApproved ? (
        <p className="mb-4">
          This diagnostic has been approved by the FDA under{" "}
          <Link href="https://www.wikiwand.com/en/Emergency_Use_Authorization">
            Emergency Use Authorization
          </Link>
          {fdaApprovalDate ? ` (${spelled(fdaApprovalDate)})` : null}.
          {fdaLink ? (
            <>
              {" "}
              You can read more about the diagnostic authorization{" "}
              <Link href={fdaLink}>here</Link>
            </>
          ) : null}
        </p>
      ) : null}
      {documentLink ? (
        <p className="mb-4">
          View the document describing this diagnostic's sensitivity and
          specificity <Link href={documentLink}>here</Link>.
        </p>
      ) : null}
    </div>
  );
};

export default connect(mapStateToProps)(SensitivitySpecificityCard);
