import React, { useEffect, ComponentType } from "react";
import { Dispatch } from "redux";
import { connect, useDispatch } from "react-redux";
import queryString from "query-string";
import get from "lodash.get";

import {
  getNyt,
  getStateCorrections,
  getPrevalenceMultiples,
  getTests,
} from "../utils/api";

import {
  setNyt,
  setStateCorrections,
  setPrevalenceMultiples,
  setTests,
  setTest,
  setTestDate,
  setTestResult,
  setState,
  setCounty,
} from "../redux/actions";
import { NytObject } from "../utils/nyt";
import Test from "../components/Main";
import {
  ReduxState,
  StateCorrections,
  PrevalenceMultiples,
  LocationState,
} from "../redux/reducer";
import { TestRecord, TestResult } from "../utils/test";
import Loader from "../components/Loader";
import { isValidDate, brief } from "../utils/date";

interface Props {
  dispatch: Dispatch;
  nyt: NytObject;
  stateCorrections: StateCorrections;
  prevalenceMultiples: PrevalenceMultiples;
  tests: TestRecord[];
  test: TestRecord;
  testResult: TestResult;
  testDate?: Date;
  location: LocationState;
}

interface URLDispatcherProps {
  tests: TestRecord[];
  test: TestRecord;
  testDate?: Date;
  location: LocationState;
  testResult: TestResult;
}

const mapStateToProps = (state: ReduxState) => ({
  nyt: state.nyt,
  stateCorrections: state.stateCorrections,
  prevalenceMultiples: state.prevalenceMultiples,
  tests: state.tests,
  test: state.test,
  testResult: state.testResult,
  testDate: state.testDate,
  location: state.location,
});

const URLDispatcher = ({
  test,
  testDate,
  testResult,
  location,
  tests,
}: URLDispatcherProps) => {
  const dispatch = useDispatch();
  const qs = queryString.parse(window.location.search);
  useEffect(() => {
    if (!tests || !tests.length) {
      return;
    }

    if (qs.test && get(test, "id") !== qs.test) {
      const foundTest = (tests || []).find((r) => r.id === qs.test);
      if (foundTest) {
        dispatch(setTest(foundTest));
      }
    }

    if (qs.date && qs.date !== (testDate && brief(testDate))) {
      const date = new Date(qs.date as string);
      if (isValidDate(date)) {
        dispatch(setTestDate(date));
      }
    }

    if (qs.result && qs.result !== testResult) {
      dispatch(setTestResult(qs.result as TestResult));
    }

    if (qs.state && qs.state !== get(location, "state")) {
      dispatch(setState(qs.state as string));
    }

    if (qs.county && qs.county !== get(location, "county")) {
      dispatch(setCounty(qs.county as string));
    }
  }, [test, testDate, testResult, location, dispatch, tests, qs]);

  return null;
};

const Home = ({
  nyt,
  dispatch,
  stateCorrections,
  prevalenceMultiples,
  tests,
  test,
  testResult,
  testDate,
  location,
}: Props) => {
  useEffect(() => {
    if (!tests) {
      getTests().then((records) => {
        dispatch(setTests(records));
      });
    } else {
      if (nyt) {
        if (!stateCorrections) {
          getStateCorrections().then((corrections) => {
            dispatch(setStateCorrections(corrections));
          });
        }

        if (!prevalenceMultiples) {
          getPrevalenceMultiples().then((multiples) => {
            dispatch(setPrevalenceMultiples(multiples));
          });
        }
      } else {
        getNyt().then((stateObject) => {
          dispatch(setNyt(stateObject));
        });
      }
    }
  }, [
    nyt,
    stateCorrections,
    prevalenceMultiples,
    tests,
    testResult,
    test,
    dispatch,
    testDate,
    location,
  ]);

  return (
    <div className="h-full">
      <div className="container mx-auto h-full">
        <div className="flex flex-col items-center h-full">
          <URLDispatcher
            tests={tests}
            testResult={testResult}
            test={test}
            location={location}
            testDate={testDate}
          />
          {nyt && tests ? <Test /> : <Loader />}
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps)(Home as ComponentType);
