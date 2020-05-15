import { OptionTypeBase } from "react-select";
import { Dispatch } from "redux";

export const stringToOptionType = (string: string): OptionTypeBase => ({
  label: string,
  value: string,
});

export const stringArrayToOptionType = (
  stringArray: string[]
): OptionTypeBase[] => stringArray.map(stringToOptionType);

export interface BaseInfoColumnProps {
  remainingNum: number;
  open: (questionName: string) => void;
  close: (questionName: string) => void;
  dispatch: Dispatch;
}
