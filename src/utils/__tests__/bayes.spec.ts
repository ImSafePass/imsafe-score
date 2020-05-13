import bayes, { TriplePoint } from "../bayes";
import { parseTestRecord as parse } from "../test";

import { noLowHigh, prevalence, baseState } from "./examples";

const prep = (triplepoint: TriplePoint) =>
  Object.keys(triplepoint).reduce(
    (obj, key) => ({
      ...obj,
      [key]: triplepoint[key] ? triplepoint[key].toFixed(3) : undefined,
    }),
    {}
  );

describe("bayes", () => {
  // This is just to make sure that something external isn't breaking the test
  it("has a good default test record", () => {
    const test = baseState.test;
    expect(test.specificity).toEqual({
      high: 99.91,
      low: 99.65,
      mid: 99.81,
    });
    expect(test.sensitivity).toEqual({
      high: 100,
      low: 88.1,
      mid: 100,
    });
  });

  it("calculates serological test correctly", () => {
    const test = baseState.test;
    const prev = prevalence();
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.022",
      mid: "0.033",
      high: "0.043",
    });

    expect(prep(after)).toEqual({
      low: "0.894",
      mid: "0.946",
      high: "0.974",
    });
  });

  it("calculates molecular test positive correctly", () => {
    const test = { ...baseState.test };
    test.type = "Molecular";
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.005",
      mid: "0.007",
      high: "0.010",
    });

    expect(prep(after)).toEqual({
      low: "0.648",
      mid: "0.794",
      high: "0.891",
    });
  });

  it("removes low/high from after range if either specificity or sensitivity is missing", () => {
    const test = parse(noLowHigh);
    const state = { ...baseState, test };
    const prev = prevalence(state);
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.005",
      mid: "0.007",
      high: "0.010",
    });

    expect(prep(after)).toEqual({
      low: undefined,
      mid: "0.792",
      high: undefined,
    });
  });
});
