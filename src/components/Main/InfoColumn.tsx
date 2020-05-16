import React, { ComponentType } from "react";
import Markdown from "react-markdown";
import numeral from "numeral";
import { connect } from "react-redux";

import { TestRecord } from "../../utils/test";
import { LowMidHigh } from "../../redux/reducer";
import { spelledWithYear } from "../../utils/date";
import { TriplePoint } from "../../utils/bayes";
import { ReactComponent as Caret } from "../../assets/caret.svg";

import { mapStateToProps, QuestionProps, meetsRequirements } from "./helpers";

const comp = (desc: string) => {
  return (
    <div className="flex flex-row items-center">
      <Caret className="lg:ml-4 lg:block hidden" style={{ marginRight: -1 }} />
      <div className="info-column">
        <Markdown source={desc.replace(/\n\s+/g, "\n\n")} />
      </div>
    </div>
  );
};

const InfoColumns: React.SFC<QuestionProps> = (props) => {
  if (!meetsRequirements(props)) {
    return null;
  }

  const {
    questionName,
    testType,
    test,
    testDate,
    location,
    prevalence,
    tests,
  } = props;

  switch (questionName) {
    case "testType": {
      const description = `
        A blood (**serology**) test gauges antibody levels which show that your body has responded to a COVID-19 infection.
        A swab, spit, or breath condensate (**molecular**) test looks to confirm an active infection.
      `;
      return comp(description);
    }
    case "test": {
      const description =
        testType === "Serology"
          ? `A blood (**serology**) test gauges antibody levels which show that your body has responded to a COVID-19 infection.`
          : `A swab, spit, or breath condensate (** molecular **) test looks to confirm an active infection.`;
      return comp(description);
    }
    case "testDate": {
      const t = test as TestRecord;
      const intro = t.fdaApprovalDate
        ? `This is an FDA-authorized test with a stated accuracy of`
        : `This test has a stated accuracy (${t.chosenTestEntity} measure) of`;
      const deets = `${(t.sensitivity.mid as number).toFixed(
        2
      )} sensitivity and ${(t.specificity.mid as number).toFixed(
        2
      )}% specificity.`;
      const tScores = (tests as TestRecord[]).map(
        (t) => (t.specificity.mid as number) + (t.sensitivity.mid as number)
      );
      const sorted = tScores.sort();
      const ranking = sorted.indexOf(
        (t.sensitivity.mid as number) + (t.specificity.mid as number)
      );

      const description = `
        ${intro} ${deets}.
        It is the ${numeral(ranking + 1).format(
          "0o"
        )} most accurate test we are aware of currently in the US market.
      `;

      return comp(description);
    }
    case "location": {
      // Add national averages
      const description = `
        On ${spelledWithYear(testDate as Date)} prevalence of COVID-19 ${
        testType === "Serology" ? "antibodies" : "infection"
      } varied widely in the United States.

      We estimate county-specific prevalence based on NYTimes-reported case data.
      `;

      return comp(description);
    }
    case "testResult": {
      const { estimatedCaseObject, basePopulation } = prevalence;

      const { low, mid, high } = Object.keys(estimatedCaseObject).reduce(
        // @ts-ignore
        (obj: any, key: LowMidHigh) => {
          const percent = estimatedCaseObject[key] / basePopulation;

          return {
            ...obj,
            [key]: percent,
          };
        },
        {}
      ) as TriplePoint;

      const description = `
      On ${spelledWithYear(testDate as Date)} in ${location.state}, ${
        location.county
      }, estimated prevalence for COVID-19 ${
        testType === "Serology" ? "antibodies" : "infection"
      } ranged from between ${(low as number).toFixed(
        2
      )}% and ${(high as number).toFixed(
        2
      )}% with our base case of ${mid.toFixed(2)}%.

      We consider ${mid.toFixed(
        2
      )}% to be your pre-test probability of being positive for antibodies.
      `;
      return comp(description);
    }
    default: {
      throw new Error(`No description. Question Name: ${questionName}`);
    }
  }
};

export default connect(mapStateToProps)(InfoColumns as ComponentType);
