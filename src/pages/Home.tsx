import React, { useEffect, ComponentType } from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";

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
} from "../redux/actions";
import { NytObject } from "../utils/nyt";
import Test from "../components/Test";
import {
  ReduxState,
  StateCorrections,
  PrevalenceMultiples,
} from "../redux/reducer";
import { TestRecord } from "../utils/test";
import Loader from "../components/Loader";

interface Props {
  dispatch: Dispatch;
  nyt: NytObject;
  stateCorrections: StateCorrections;
  prevalenceMultiples: PrevalenceMultiples;
  tests: TestRecord[];
}

const Home = ({
  nyt,
  dispatch,
  stateCorrections,
  prevalenceMultiples,
  tests,
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
  }, [nyt, stateCorrections, prevalenceMultiples, tests, dispatch]);

  return (
    <div className="my-10">
      <div className="container mx-auto my10">
        <div className="flex flex-col items-center">
          {tests ? <Test /> : <Loader />}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ReduxState) => ({
  nyt: state.nyt,
  stateCorrections: state.stateCorrections,
  prevalenceMultiples: state.prevalenceMultiples,
  tests: state.tests,
});

export default connect(mapStateToProps)(Home as ComponentType);
