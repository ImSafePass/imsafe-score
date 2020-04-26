import React from "react";
import { useForm } from "react-hook-form";
import Select, { OptionTypeBase } from "react-select";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type FormData = {
  testDate: Date;
  test: OptionTypeBase;
};

const options: OptionTypeBase[] = ["Abbot Architect", "Roche PCR"].map((s) => ({
  value: s,
  label: s,
}));

export default () => {
  const { register, setValue, handleSubmit, errors, getValues } = useForm<
    FormData
  >();

  const onSubmit = handleSubmit(({ testDate, test }) => {
    console.log(testDate, test);
  });

  const test = getValues("test");
  const testDate = getValues("testDate");

  const today = new Date();

  console.log({ errors, testDate, test });
  return (
    <div className="card">
      <form onSubmit={onSubmit} className="flex flex-col">
        <label className="font-bold mb-2">Test Date</label>
        <DatePicker
          ref={(r) => {
            console.log("HERE", r);
            return register(
              { name: "testDate", type: "custom" },
              { required: true }
            );
          }}
          className="w-40 p-1 rounded-md mb-4"
          selected={testDate}
          onChange={(date: Date) => {
            console.log(date);
            setValue("testDate", date);
          }}
          maxDate={today}
        />
        {testDate ? (
          <>
            <label className="font-bold mb-2">Test Name</label>
            <Select
              className="w-40 p-1 rounded-md mb-4"
              ref={() =>
                register({ name: "test", type: "custom" }, { required: true })
              }
              value={test}
              onChange={(opt: OptionTypeBase) => {
                setValue("test", opt);
              }}
              options={options}
            />
          </>
        ) : null}
        {errors ? null : <input type="submit" />}
      </form>
    </div>
  );
};
