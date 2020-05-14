import { OptionTypeBase } from "react-select";

import { isValidDate } from "./date";
import { LowMidHigh } from "../redux/reducer";

/** PUBLIC */

export type TestType = "Serology" | "Molecular";
export type TestResult = "Positive" | "Negative";

export interface ApiTestRecord {
  id: string;
  createdTime: string;
  fields: TestRecordFields;
}

export type SpecificityOrSensitivity = {
  [key in LowMidHigh]?: number;
};

export interface TestRecord {
  id: string;
  createdTime: Date;
  diagnostic: string;
  manufacturer: string;
  fdaApprovalDate?: Date;
  euaApproved: Boolean;
  type: TestType;
  typeDetail: string;
  fdaLink?: string;
  sensitivity: SpecificityOrSensitivity;
  specificity: SpecificityOrSensitivity;
  chosenTestEntity: "independent" | "manufacturer";
  documentLink?: string;
}

export interface TestOption extends OptionTypeBase {
  label: string;
  value: TestRecord;
}

export interface TestRecordResults {
  testTypes: OptionTypeBase[];
  testOptions: TestOption[];
}

export const getTestRecords = (records: ApiTestRecord[]): TestRecord[] => {
  const testRecords: TestRecord[] = [];
  // @ts-ignore
  window.records = records;
  records.forEach((rec) => {
    const result = parseTestRecord(rec);
    if (result) {
      testRecords.push(result);
    }
  });

  return testRecords;
};

/** PRIVATE */

type ConfidenceIntervalKey =
  | "manufacturer_test_of_specificity_95%_ci"
  | "manufacturer_test_of_sensitivity_95%_ci"
  | "independent_test_of_specificity_95%_ci"
  | "independent_test_of_sensitivity_95%_ci";
type SensitivityKey =
  | "independent_test_of_sensitivity"
  | "manufacturer_test_of_sensitivity";

type ScoreKey =
  | SensitivityKey
  | "independent_test_of_specificity"
  | "manufacturer_test_of_specificity";

type TestEntity = "independent" | "manufacturer";

interface TestRecordFields {
  diagnostic?: string;
  diagnostic_detail?: string;
  eua_approval?: string;
  eua_listed_by_fda?: string;
  fda_document_link?: string;
  fda_document_type?: string;
  independent_document_link?: string;
  independent_document_type?: string;
  "independent_test_of_sensitivity,_min_days_post_onset"?: string;
  "independent_test_of_sensitivity_95%_ci"?: string;
  independent_test_of_sensitivity?: string;
  "independent_test_of_specificity,_min_days_post_onset"?: string;
  "independent_test_of_specificity_95%_ci"?: string;
  independent_test_of_specificity?: string;
  manufacturer?: string;
  manufacturer_document_link?: string;
  manufacturer_document_type?: string;
  "manufacturer_test_of_sensitivity,_min_days_post_onset"?: string;
  "manufacturer_test_of_sensitivity_95%_ci"?: string;
  manufacturer_test_of_sensitivity?: string;
  "manufacturer_test_of_specificity,_min_days_post_onset"?: string;
  "manufacturer_test_of_specificity_95%_ci"?: string;
  manufacturer_test_of_specificity?: string;
  no_data?: string;
  notes_on_highlight?: string;
  type?: string;
}

const parseSpecificitySensitivity = (
  fields: TestRecordFields,
  scoreName: "specificity" | "sensitivity",
  testEntity: string
): SpecificityOrSensitivity => {
  const boundKey: ConfidenceIntervalKey = `${testEntity}_test_of_${scoreName}_95%_ci` as ConfidenceIntervalKey;
  const bound: string | undefined = fields[boundKey];
  const midpointKey: ScoreKey = `${testEntity}_test_of_${scoreName}` as ScoreKey;

  const midPointField = fields[midpointKey];
  const mid = midPointField ? parseFloat(midPointField) : undefined;
  let low;
  let high;

  // If bound not provided, give indication that it's lacking.

  if (bound && bound.length) {
    [low, high] = bound.split("-").map((v) => parseFloat(v));
  }

  return {
    low,
    high,
    mid,
  };
};

export const parseTestRecord = (record: ApiTestRecord): TestRecord | null => {
  const { fields, id, createdTime } = record;
  const {
    diagnostic,
    manufacturer,
    type,
    fda_document_link,
    eua_approval,
    eua_listed_by_fda,
    manufacturer_document_link,
    independent_document_link,
  } = fields;

  if (!(type?.includes("Serology") || type?.includes("Molecular"))) {
    return null;
  }

  if (!diagnostic || !manufacturer) {
    return null;
  }

  const chosenTestEntity: TestEntity | undefined = [
    "independent",
    "manufacturer",
  ].find((string: string) => {
    // Assumption - if we have sensitivity, we have specificity
    const key: SensitivityKey = `${string}_test_of_sensitivity` as SensitivityKey;
    return fields[key]?.length;
  }) as TestEntity | undefined;

  // Don't show test if no sensivitity rating
  if (!chosenTestEntity) {
    return null;
  }

  const specificity = parseSpecificitySensitivity(
    fields,
    "specificity",
    chosenTestEntity
  );
  const sensitivity = parseSpecificitySensitivity(
    fields,
    "sensitivity",
    chosenTestEntity
  );

  if (!specificity.mid || !sensitivity.mid) {
    return null;
  }

  const euaDate =
    eua_listed_by_fda &&
    eua_listed_by_fda.length &&
    new Date(eua_listed_by_fda);

  return {
    id: id,
    createdTime: new Date(createdTime),
    sensitivity,
    specificity,
    diagnostic,
    manufacturer,
    chosenTestEntity,
    euaApproved: !!eua_approval && eua_approval === "Y",
    fdaApprovalDate: euaDate && isValidDate(euaDate) ? euaDate : undefined,
    fdaLink: fda_document_link,
    type: type.split(" ")[0] as TestType,
    typeDetail: type,
    documentLink: manufacturer_document_link || independent_document_link,
  };
};
