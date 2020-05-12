import { parseTestRecord as parse, getTestRecords, TestRecord } from "../test";
import allParsed, {
  manufacturerScoring,
  noLowHigh,
  independentScoring,
  insufficientScoring,
  badType,
  noManufacturer,
  noDiagnostic,
} from "./examples";

describe("parseTestRecord", () => {
  it("parses specificity/sensitivity with confidence intervals", () => {
    const parsed = parse(manufacturerScoring);
    const {
      specificity,
      sensitivity,
      diagnostic,
      manufacturer,
      chosenTestEntity,
      type,
      typeDetail,
    } = parsed;

    expect(sensitivity.mid).toBe(100);
    expect(sensitivity.low).toBe(88.1);
    expect(sensitivity.high).toBe(100);

    expect(specificity.mid).toBe(99.81);
    expect(specificity.low).toBe(99.65);
    expect(specificity.high).toBe(99.91);

    expect(chosenTestEntity).toBe("manufacturer");
    expect(type).toBe("Serology");
    expect(diagnostic).toBe("Elecsys Anti-SARS-CoV-2");
    expect(manufacturer).toBe("Roche Diagnostics");
    expect(typeDetail).toBe("Serology Antibody");
  });

  it("returns null for records missing key fields", () => {
    expect(parse(noManufacturer)).toBe(null);
    expect(parse(noDiagnostic)).toBe(null);
  });

  it("returns null for bad types", () => {
    expect(parse(badType)).toBe(null);
  });

  it("returns null for records without sufficient scoring data", () => {
    expect(parse(insufficientScoring)).toBe(null);
  });

  it("handles lack of ranges", () => {
    const parsed = parse(noLowHigh);
    const { specificity, sensitivity } = parsed;
    expect(specificity).toEqual({
      mid: 99.81,
    });
    expect(sensitivity).toEqual({
      mid: 99,
    });
  });

  it("preferences independent over manufacturer data", () => {
    const parsed = parse(independentScoring);
    const { chosenTestEntity, specificity, sensitivity } = parsed;
    expect(chosenTestEntity).toBe("independent");
    expect(specificity.low).toBe(99.9);
    expect(specificity.high).toBe(100);
    expect(specificity.mid).toBe(100);
    expect(sensitivity.low).toBe(69.2);
    expect(sensitivity.high).toBe(99.6);
    expect(sensitivity.mid).toBe(82.3);
  });
});

describe("getTestRecords", () => {
  it("excludes null records", () => {
    expect(allParsed.length).toBe(7);
    expect(getTestRecords(allParsed).length).toBe(3);
  });
});
