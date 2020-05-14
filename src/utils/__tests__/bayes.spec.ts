import bayes, { TriplePoint } from "../bayes";
import { parseTestRecord as parse } from "../test";

import { noLowHigh, prevalence, baseState } from "./examples";

const prep = (triplepoint: TriplePoint) =>
  ["low", "mid", "high"].reduce(
    (obj, key) => ({
      ...obj,
      [key]: triplepoint[key] ? triplepoint[key].toFixed(4) : undefined,
    }),
    {}
  );

describe("bayes", () => {
  // This is just to make sure that something external isn't breaking the test
  it("has a good default test record", () => {
    const test = baseState.test;
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
    const bayesResults = bayes(prev, test, "Positive");

    const { after, before } = bayesResults;
    expect(prep(before)).toEqual({
      low: "0.0217",
      high: "0.0433",
      mid: "0.0325",
    });

    expect(prep(after)).toEqual({
      low: "0.8943",
      mid: "0.9465",
      high: "0.9739",
    });
    //   low: "0.894", // I don't thiink this is right -- I get 89.57%
    //   mid: "0.946", // I don't thiink this is right -- I get 94.73%
    //   high: "0.974", // I don't thiink this is right -- I get 97.43%
    // });
  });

  it("calculates molecular test positive correctly", () => {
    const test = { ...baseState.test };
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
      high: "0.8905",
      low: "0.6482",
      mid: "0.7939",
    });
    //   low: "0.648", // I get 63.96%
    //   mid: "0.794", // I get 78.77%
    //   high: "0.891", // I get 88.68%
    // });
  });

  it("calculates any test negtive correctly", () => {
    const test = { ...baseState.test };
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
      high: "1.0000",
      mid: "1.0000",
    });
  });

  it("removes low/high from after range if either specificity or sensitivity is missing", () => {
    const test = parse(noLowHigh);
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
});
