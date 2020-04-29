import React from "react";
import Select, { OptionTypeBase } from "react-select";

interface Props {
  gate?: any;
  text: string;
  value: OptionTypeBase | null;
  set: (opt: OptionTypeBase) => void;
  options: OptionTypeBase[];
}

const DropdownQuestion = ({ gate, text, value, set, options }: Props) => {
  if (!gate) return null;

  return (
    <div className="mt-8">
      <h4>{text}</h4>
      <Select
        className="w-40 p-1 rounded-md my-2"
        placeholder="Test name"
        value={value}
        onChange={(opt: OptionTypeBase) => {
          set(opt);
        }}
        options={options}
      />
    </div>
  );
};

export default DropdownQuestion;
