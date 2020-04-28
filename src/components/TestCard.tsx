import React, { useState, FormEvent } from "react";
import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { NytObject, NytState, formatDate } from "../utils/nyt";

import Prevalence from "./Prevalence";

interface Props {
  caseData: NytObject;
}

const stringArrayToOptionType = (stringArray: string[]): OptionTypeBase[] =>
  stringArray.map((s) => ({ label: s, value: s }));

const testTypeOptions: OptionTypeBase[] = stringArrayToOptionType([
  "Antibody",
  "PCR",
]);

const testOptions: OptionTypeBase[] = stringArrayToOptionType([
  "Abbot Architect",
  "Roche PCR",
]);

export default ({ caseData }: Props) => {
  const [countyOptions, setCountyOptions] = useState<OptionTypeBase[]>([]);
  const [state, setState] = useState<OptionTypeBase | null>(null);
  const [county, setCounty] = useState<OptionTypeBase | null>(null);
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [test, setTest] = useState<OptionTypeBase | null>(null);

  const stateOptions: OptionTypeBase[] = Object.keys(caseData)
    .sort()
    .map((state) => ({
      value: state,
      label: state,
    }));

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const today = new Date();

  const countyData = state && county && caseData[state.value][county.value];

  return (
    <div className="card">
      <form onSubmit={onSubmit} className="flex flex-col">
        <h5>1. Where do you live?</h5>
        <div className="flex flex-row items-center">
          <div className="w-40 mr-10 my-10">
            <label className="font-bold">State</label>
            <Select
              className="my-2"
              options={stateOptions}
              name="state"
              value={state}
              isSearchable
              onChange={(opt: OptionTypeBase) => {
                setCounty(null);
                setState(opt);
                const countyData: NytState = caseData[opt.value];
                const options: OptionTypeBase[] = Object.keys(countyData)
                  .sort()
                  .map((k) => ({
                    label: k,
                    value: k,
                  }));
                setCountyOptions(options);
              }}
            />
          </div>

          {state ? (
            <div className="w-40 mr-10">
              <label className="font-bold">County</label>
              <Select
                className="my-2"
                options={countyOptions}
                name="county"
                value={county}
                isSearchable
                onChange={(opt: OptionTypeBase) => {
                  setCounty(opt);
                }}
              />
            </div>
          ) : null}
        </div>

        {countyData && state && county ? (
          <p className="my-4">
            As of{" "}
            <span className="font-bold">{formatDate(countyData.date)}</span>,
            NYT tracking data reported{" "}
            <span className="font-bold"> {county.label}</span>,{" "}
            <span className="font-bold">{state.label}</span> as having{" "}
            <span className="font-bold">{countyData.cases}</span> total cases,
            resulting in <span className="font-bold">{countyData.deaths}</span>{" "}
            deaths.
          </p>
        ) : null}

        {countyData ? <Prevalence cases={countyData.cases} /> : null}

        {county ? (
          <div className="my-4">
            <h5>2. When were you tested?</h5>
            <DatePicker
              className="w-40 p-1 rounded-md mb-4"
              selected={testDate}
              onChange={(date: Date) => {
                setTestDate(date);
              }}
              maxDate={today}
            />
          </div>
        ) : null}

        {testDate ? (
          <div className="my-4">
            <label className="font-bold mb-2">Test Name</label>
            <Select
              className="w-40 p-1 rounded-md mb-4"
              value={test}
              onChange={(opt: OptionTypeBase) => {
                setTest(opt);
              }}
              options={testOptions}
            />
          </div>
        ) : null}
        {/* <input type="submit" /> */}
      </form>
    </div>
  );
};
