import { TestRecord } from "../utils/test";
import { NytObject } from "../utils/nyt";

export interface LocationState {
  state?: string;
  county?: string;
  countyPopulation?: number;
}

export interface PrevalenceDatePoint {
  date: Date;
  cases: number;
}

export interface StateCorrections {
  [state: string]: number;
}

export interface PrevalenceMultiple {
  value: number;
  source: string;
}

export type LowMidHigh = "low" | "mid" | "high";

export type PrevalenceMultiples = {
  [K in LowMidHigh]: PrevalenceMultiple;
};

export interface ReduxState {
  test?: TestRecord;
  tests?: TestRecord[];
  testDate?: Date;
  location: LocationState;
  nyt?: NytObject;
  stateCorrections?: StateCorrections;
  prevalenceMultiples?: PrevalenceMultiples;
  testResult?: string;
}

export interface ReduxAction {
  type: string;
  [key: string]: any;
}

const initialState: ReduxState = {
  location: {},
};

const rootReducer = (
  state: ReduxState = initialState,
  action: ReduxAction
): ReduxState => {
  switch (action.type) {
    case "SET_TEST": {
      return { ...state, test: action.test };
    }

    case "SET_TESTS": {
      return { ...state, tests: action.tests };
    }

    case "SET_TEST_RESULT": {
      return { ...state, testResult: action.testResult };
    }

    // Reset county when setting state.
    // Also, set county options.
    case "SET_STATE": {
      return {
        ...state,
        location: {
          ...state.location,
          state: action.state,
          county: undefined,
          countyPopulation: undefined,
        },
      };
    }

    case "SET_COUNTY": {
      const county = action.county;

      const statePopData = require(`../data/county-populations/${state.location.state}.js`)
        .default;
      const countyPopulation = parseInt(statePopData[county]);

      return {
        ...state,
        location: {
          ...state.location,
          county,
          countyPopulation,
        },
      };
    }

    case "SET_TEST_DATE": {
      return { ...state, testDate: action.testDate };
    }

    case "SET_NYT": {
      return { ...state, nyt: action.nyt };
    }

    case "SET_STATE_CORRECTIONS": {
      return { ...state, stateCorrections: action.stateCorrections };
    }

    case "SET_PREVALENCE_MULTIPLES": {
      return { ...state, prevalenceMultiples: action.prevalenceMultiples };
    }

    default: {
      return state;
    }
  }
};

export default rootReducer;
