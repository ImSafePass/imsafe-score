import bayes, { TriplePoint } from "../bayes";
import { parseTestRecord as parse, TestRecord } from "../test";

import { noLowHigh, prevalence, baseState } from "./examples";
import { LowMidHigh } from "../../redux/reducer";
import { Prevalence } from "../prevalence";

const prep = (triplepoint: TriplePoint) =>
  (["low", "mid", "high"] as LowMidHigh[]).reduce(
    (obj, key) => ({
      ...obj,
      [key]: triplepoint[key]
        ? (triplepoint[key] as number).toFixed(4)
        : undefined,
    }),
    {}
  );

describe("bayes", () => {
  // This is just to make sure that something external isn't breaking the test
  it("has a good default test record", () => {
    const test = baseState.test as TestRecord;
    expect(test.sensitivity).toEqual({
      low: 88.1,
      mid: 100,
      high: 100,
    });
    expect(test.specificity).toEqual({
      low: 99.65,
      mid: 99.81,
      high: 99.91,
    });
  });

  it("calculates serological test correctly", () => {
    const test = baseState.test;
    const prev = prevalence();
    const bayesResults = bayes(
      prev as Prevalence,
      test as TestRecord,
      "Positive"
    );

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.0217",
      high: "0.0433",
      mid: "0.0325",
    });

    expect(prep(after)).toEqual({
      low: "0.8943",
      mid: "0.9460",
      high: "0.9737",
    });
    //   low: "0.894", // I don't thiink this is right -- I get 89.57%
    //   mid: "0.946", // I don't thiink this is right -- I get 94.73%
    //   high: "0.974", // I don't thiink this is right -- I get 97.43%
    // });
  });

  it("calculates molecular test positive correctly", () => {
    const test = { ...baseState.test } as TestRecord;
    test.type = "Molecular";
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      high: "0.0097",
      low: "0.0048",
      mid: "0.0073",
    });

    expect(prep(after)).toEqual({
      high: "0.8895",
      low: "0.6482",
      mid: "0.7923",
    });
    //   low: "0.648", // I get 63.96%
    //   mid: "0.794", // I get 78.77%
    //   high: "0.891", // I get 88.68%
    // });
  });

  it("calculates any test negtive correctly", () => {
    const test = { ...baseState.test } as TestRecord;
    test.type = "Molecular";
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Negative");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      high: "0.9952",
      low: "0.9903",
      mid: "0.9927",
    });

    expect(prep(after)).toEqual({
      low: "0.9991",
      high: "0.9999",
      mid: "0.9999",
    });
  });

  it("removes low/high from after range if either specificity or sensitivity is missing", () => {
    const test = parse(noLowHigh) as TestRecord;
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.0048",
      mid: "0.0073",
      high: "0.0097",
    });

    expect(prep(after)).toEqual({
      low: undefined,
      mid: "0.7923",
      high: undefined,
    });
  });

  it("trims artificial highs", () => {
    const test = { ...baseState.test } as TestRecord;
    test.type = "Molecular";
    test.specificity = {
      low: 100,
      mid: 100,
      high: 100,
    };
    test.sensitivity = {
      low: 100,
      mid: 100,
      high: 100,
    };
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Negative");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      high: "0.9952",
      low: "0.9903",
      mid: "0.9927",
    });

    expect(prep(after)).toEqual({
      high: "0.9999",
      low: "0.9999",
      mid: "0.9999",
    });
  });
});
