import React, { useState, FormEvent } from "react";
import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";
import get from "lodash.get";

import "react-datepicker/dist/react-datepicker.css";

import { NytObject, NytState, PrevalencePoint } from "../utils/nyt";

import Prevalence from "./Prevalence";
import Loader from "./Loader";
import DropdownQuestion from "./DropdownQuestion";

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

  const dataPoint: PrevalencePoint | undefined = (get(
    caseData,
    `${state && state.label}.${county && county.label}.${
      testDate?.toISOString().split("T")[0]
    }`
  ) as unknown) as PrevalencePoint;

  console.log(caseData, state, county, testDate, dataPoint);

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
          </div>

          {county ? (
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

          <div className="my-4">
            {dataPoint && testDate && state && county ? (
              <Prevalence
                dataPoint={dataPoint}
                date={testDate}
                state={state.label}
                county={county.label}
              />
            ) : null}
          </div>

          <DropdownQuestion
            gate={testDate}
            value={testType}
            text="3. What type of test did you take?"
            options={testTypeOptions}
            set={setTestType}
          />

          <DropdownQuestion
            gate={testType}
            value={test}
            text={`4. Which ${
              testType ? `${testType.label} ` : ""
            }test did you take?`}
            set={setTest}
            options={testOptions}
          />

          {test ? (
            <input
              className="px-4 py-2 bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white my-4 rounded-md cursor-pointer max-w-sm"
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
