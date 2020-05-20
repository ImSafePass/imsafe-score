import React, { ComponentType } from "react";
import Markdown from "react-markdown";
import numeral from "numeral";
import { connect } from "react-redux";

import { TestRecord } from "../../utils/test";
import { LowMidHigh } from "../../redux/reducer";
import { spelledWithYear } from "../../utils/date";
import { TriplePoint } from "../../utils/bayes";
import { asPercent } from "../../utils/number";
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
  if (!meetsRequirements(props) || props.questionName === "intro") {
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
        A blood (**serology**) test gauges antibody levels which show that your body has responded to a Covid-19 infection.
        A swab, spit, or breath condensate (**molecular**) test looks to confirm an active infection.
      `;
      return comp(description);
    }
    case "test": {
      const description = `Different test manufacturers and test kits have different accuracies. Select the test kit you used so we can help indicate the predictive value of your results`;
      return comp(description);
    }
    case "testDate": {
      const t = test as TestRecord;
      const intro = t.fdaApprovalDate
        ? `This is an FDA-authorized test with a stated accuracy of`
        : `This test has a stated accuracy (${t.chosenTestEntity} measure) of`;
      const deets = `**${asPercent(
        t.sensitivity.mid as number
      )} sensitivity** and **${asPercent(
        t.specificity.mid as number
      )} specificity**`;

      const rank = (tst: TestRecord) => {
        const average = (scores: Array<number | undefined>): number => {
          const presentScoresArray: number[] = scores.reduce(
            (arr: number[], score: number | undefined) =>
              score ? [...arr, score] : arr,
            []
          );
          const sumOfScores = presentScoresArray.reduce(
            (sum, score) => sum + score,
            0
          );
          return sumOfScores / presentScoresArray.length;
        };

        return average([
          average(Object.values(tst.sensitivity)),
          average(Object.values(tst.specificity)),
        ]);
      };

      const tScores = (tests as TestRecord[])
        .filter((t) => t.type === testType)
        .map((tst) => rank(tst));
      const sorted = tScores.sort((a, b) => b - a);

      const ranking = sorted.indexOf(rank(t));

      const description = `
        ${intro} ${deets}.
        These numbers are imperfectly accurate. If taken directly, they make it the **${numeral(
          ranking + 1
        ).format(
          "0o"
        )} most accurate ${testType?.toLowerCase()} test** we are aware of currently in the US market, factoring in confidence intervals where given.
      `;

      return comp(description);
    }
    case "location": {
      // Add national averages
      const description = `
        On ${spelledWithYear(testDate as Date)} prevalence of Covid-19 ${
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
      }, our estimated prevalence for Covid-19 ${
        testType === "Serology" ? "antibodies" : "infection"
      } ranged from between ${asPercent((low as number) * 100)} and ${asPercent(
        (high as number) * 100
      )} with our base case of ${asPercent(mid * 100)} (${numeral(
        estimatedCaseObject.mid
      ).format("0,0")} out of ${numeral(basePopulation).format("0,0")}).

      We consider ${asPercent(
        mid * 100
      )} to be your pre-test probability of being positive for antibodies.
      `;
      return comp(description);
    }
    default: {
      throw new Error(`No description. Question Name: ${questionName}`);
    }
  }
};

export default connect(mapStateToProps)(InfoColumns as ComponentType);
