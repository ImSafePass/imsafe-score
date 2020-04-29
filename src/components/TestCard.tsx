import React, { useState, FormEvent } from "react";
import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

import { NytObject, NytState, formatDate } from "../utils/nyt";

import Prevalence from "./Prevalence";
import Loader from "./Loader";

interface Props {
  caseData?: NytObject;
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
  const [testType, setTestType] = useState<OptionTypeBase | null>(null);

  const stateOptions: OptionTypeBase[] = caseData
    ? Object.keys(caseData)
        .sort()
        .map((state) => ({
          value: state,
          label: state,
        }))
    : [];

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  const today = new Date();

  const countyData =
    caseData && state && county && caseData[state.value][county.value];

  return (
    <div className="card min-h-10">
      {caseData ? (
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="my-4">
            <h4>1. Where do you live?</h4>
            <div className="flex flex-row items-center">
              <div className="w-40 mr-10 my-10">
                <Select
                  className="my-2"
                  options={stateOptions}
                  name="state"
                  value={state}
                  placeholder="State"
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
                  <Select
                    className="my-2"
                    options={countyOptions}
                    placeholder="County"
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
              <p className="m5-4">
                As of{" "}
                <span className="font-bold">{formatDate(countyData.date)}</span>
                , NYT tracking data reported{" "}
                <span className="font-bold"> {county.label}</span>,{" "}
                <span className="font-bold">{state.label}</span> as having{" "}
                <span className="font-bold">{countyData.cases}</span> total
                cases, resulting in{" "}
                <span className="font-bold">{countyData.deaths}</span> deaths.
              </p>
            ) : null}

            {countyData ? <Prevalence cases={countyData.cases} /> : null}
          </div>

          {countyData ? (
            <div className="mt-8">
              <h4>2. When were you tested?</h4>
              <DatePicker
                className="w-40 p-1 rounded-md my-4"
                selected={testDate}
                onChange={(date: Date) => {
                  setTestDate(date);
                }}
                maxDate={today}
              />
            </div>
          ) : null}

          {testDate ? (
            <div className="mt-8">
              <h4>3. What type of test did you take?</h4>
              <Select
                className="w-40 p-1 rounded-md my-2"
                placeholder="Test type"
                value={testType}
                onChange={(opt: OptionTypeBase) => {
                  setTestType(opt);
                }}
                options={testTypeOptions}
              />
            </div>
          ) : null}

          {testType ? (
            <div className="mt-8">
              <h4>3. Which {testType.label} test did you take?</h4>
              <Select
                className="w-40 p-1 rounded-md my-2"
                placeholder="Test name"
                value={test}
                onChange={(opt: OptionTypeBase) => {
                  setTest(opt);
                }}
                options={testOptions}
              />
            </div>
          ) : null}
          {test ? (
            <input
              className="p-4 bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white my-4 rounded-md cursor-pointer"
              type="submit"
              value="See Results"
            />
          ) : null}
        </form>
      ) : (
        <Loader />
      )}
    </div>
  );
};
