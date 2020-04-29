export const url =
  "https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv";

export interface NytCounty {
  cases: number;
  deaths: number;
  date: Date;
}

export interface NytState {
  [key: string]: NytCounty;
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

export const formatDate = (d: Date) =>
  `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;
const lastYear = new Date();
lastYear.setFullYear(2018);

const caseObject = (
  current: { cases: string; deaths: string; date: string },
  prev: { cases: number; deaths: number; date: Date } = {
    cases: 0,
    deaths: 0,
    date: lastYear,
  }
) => ({
  cases: parseInt(current.cases) + prev.cases,
  deaths: parseInt(current.deaths) + prev.deaths,
  date: new Date(current.date) > prev.date ? new Date(current.date) : prev.date,
});

export const arrayToStateObject = (array: CSVRow[]) => {
  const stateObject: NytObject = {};

  array.forEach(({ county, state, cases, deaths, date }) => {
    if (stateObject[state]) {
      const prev = stateObject[state][county] || {
        cases: 0,
        deaths: 0,
        date: lastYear,
      };
      stateObject[state][county] = caseObject({ cases, deaths, date }, prev);
    } else {
      stateObject[state] = { [county]: caseObject({ cases, deaths, date }) };
    }
  });

  return stateObject;
};
