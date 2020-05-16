import { Prevalence } from "./prevalence";
import { TestRecord, TestResult } from "./test";
import { LowMidHigh } from "../redux/reducer";

export interface TriplePoint {
  low?: number;
  mid: number;
  high?: number;
}

export interface ReliableTriplePoint {
  low: number;
  mid: number;
  high: number;
}

interface BayesResult {
  specificity: number;
  sensitivity: number;
  bayesPercent: number;
}

interface BayesResults {
  low?: BayesResult;
  mid: BayesResult;
  high?: BayesResult;
}

const bayesResults = (
  prevalence: Prevalence,
  test: TestRecord,
  testResult: TestResult
) => {
  const lowPopPercent =
    prevalence.estimatedCaseObject.low / prevalence.basePopulation;
  const midPopPercent =
    prevalence.estimatedCaseObject.mid / prevalence.basePopulation;
  const highPopPercent =
    prevalence.estimatedCaseObject.high / prevalence.basePopulation;

  const after: TriplePoint = (["low", "mid", "high"] as LowMidHigh[]).reduce(
    (obj, key) => {
      const rawSpecificity = test.specificity[key];
      const rawSensitivity = test.sensitivity[key];

      if (rawSpecificity && rawSensitivity) {
        const specificity = (rawSpecificity as number) / 100;
        const sensitivity = (rawSensitivity as number) / 100;

        const bayesPercent =
          testResult === "Positive"
            ? (sensitivity * midPopPercent) /
              (sensitivity * midPopPercent +
                (1 - specificity) * (1 - midPopPercent))
            : (specificity * (1 - midPopPercent)) /
              (specificity * (1 - midPopPercent) +
                (1 - sensitivity) * midPopPercent);

        return { ...obj, [key]: bayesPercent };
      } else {
        return obj;
      }
    },
    {}
  ) as TriplePoint;

  const pop: TriplePoint = {
    low: lowPopPercent,
    mid: midPopPercent,
    high: highPopPercent,
  };

  const before: ReliableTriplePoint =
    testResult === "Positive"
      ? (pop as ReliableTriplePoint)
      : ({
          low: pop.high ? 1 - pop.high : pop.high,
          mid: pop.mid ? 1 - pop.mid : pop.mid,
          high: pop.low ? 1 - pop.low : pop.low,
        } as ReliableTriplePoint);

  return { before, after };
};

export default bayesResults;
