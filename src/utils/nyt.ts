import set from "lodash.set";

export const url =
  "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

export interface PrevalencePoint {
  cases: number;
  deaths: number;
}

export interface NytCounty {
  [date: string]: PrevalencePoint;
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
}): PrevalencePoint => ({
  cases: parseInt(cases),
  deaths: parseInt(deaths),
});

export const arrayToStateObject = (array: CSVRow[]) => {
  const stateObject: NytObject = {};

  array.forEach(({ county, state, cases, deaths, date }) => {
    set(stateObject, `${state}.${county}.${date}`, toPoint({ cases, deaths }));
  });

  return stateObject;
};
