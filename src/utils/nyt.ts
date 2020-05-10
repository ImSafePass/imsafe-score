import set from "lodash.set";

export interface NytPoint {
  cases: number;
  deaths: number;
}

export interface NytCounty {
  [date: string]: NytPoint;
}

export interface NytState {
  [state: string]: NytCounty;
}

export interface NytObject {
  [key: string]: NytState;
}

export interface CSVRow {
  county: string;
  state: string;
  cases: string;
  deaths: string;
  date: string;
}

const toPoint = ({
  cases,
  deaths,
}: {
  cases: string;
  deaths: string;
}): NytPoint => ({
  cases: parseInt(cases),
  deaths: parseInt(deaths),
});

export const arrayToStateObject = (array: CSVRow[]) => {
  const stateObject: NytObject = {};

  array.forEach(({ county, state, cases, deaths, date }) => {
    if (county !== "Unknown") {
      set(
        stateObject,
        `${state}.${county}.${date}`,
        toPoint({ cases, deaths })
      );
    }
  });

  return stateObject;
};
