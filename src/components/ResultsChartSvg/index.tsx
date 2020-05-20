import React from "react";

import { TriplePoint } from "../../utils/bayes";

import "./index.scss";
import { LocationState } from "../../redux/reducer";

interface Props {
  before: {
    low: number;
    mid: number;
    high: number;
  };
  after: TriplePoint;
  location: LocationState;
}

const Bar = ({
  beforeOrAfter,
  data,
}: {
  beforeOrAfter: string;
  data: TriplePoint;
}) => (
  <div
    className={`bar-${beforeOrAfter.toLocaleLowerCase()} w-full flex flex-row items-center`}
    style={{ height: 80 }}
  >
    <div style={{ minWidth: 80 }}>
      <p className="text-right pr-4" style={{ fontSize: 14 }}>
        {beforeOrAfter === "Before" ? "Pre" : "Post"} test
      </p>
    </div>
    <div className="w-full relative flex flex-row items-center">
      {data.low && data.high ? (
        <div
          className="bar__big absolute"
          style={{
            left: `${(data.low || 0) * 100}%`,
            width: `${((data.high || 0) - (data.low || 0)) * 100}%`,
          }}
        />
      ) : null}
      <div
        className="bar__small absolute"
        style={{ width: `${data.mid * 100}%`, left: 0 }}
      />
      <p
        className="absolute bar__percent--mid"
        style={{ left: `calc(${data.mid * 100}% + 5px)` }}
      >
        <strong>{(data.mid * 100).toFixed(2)}%</strong>
      </p>
      {data.low && data.high && data.high - data.low > 0.02 ? (
        <p
          className="absolute bar__percent--low"
          style={{
            left: `calc(${data.low * 100}% - ${
              data.low * 100 > 9 ? "25" : "20"
            }px)`,
          }}
        >
          {(data.low * 100).toFixed(1)}%
        </p>
      ) : null}
      {data.low && data.high && data.high - data.low > 0.02 ? (
        <p
          className="absolute bar__percent--high"
          style={{ left: `calc(${data.high * 100}%)` }}
        >
          {(data.high * 100).toFixed(1)}%
        </p>
      ) : null}
    </div>
  </div>
);

const ResultsChart = ({ before, after }: Props) => {
  return (
    <div className="flex flex-col bg-white rounded-sm p-8 my-8 result-bars">
      <Bar beforeOrAfter="Before" data={before} />
      <Bar beforeOrAfter="After" data={after} />

      {/* Ticks */}
      <div className="relative" style={{ marginLeft: 80 }}>
        <div
          className="relative"
          style={{
            width: "100%",
            borderBottom: "1px solid black",
            marginBottom: 50,
          }}
        >
          {new Array(6).fill("").map((el, ind) => (
            <div
              className="absolute"
              style={{ left: `calc(${ind * 20}% - 5px)` }}
              key={ind}
            >
              <div
                style={{
                  width: 10,
                  borderBottom: "1px solid black",
                  transform: "rotate(90deg)",
                }}
              />
              <p
                className="mt-2 text-xs"
                style={{
                  marginLeft: -(((ind * 20).toString().length - 1) * 2),
                }}
              >
                {ind * 20}%
              </p>
            </div>
          ))}
        </div>

        {/* Confidence indicator */}
        {after.low && after.high ? (
          <div
            className="relative confidence-interval"
            style={{
              left: `${after.low * 100}%`,
              width: `${(after.high - after.low) * 100}%`,
            }}
          >
            <div
              style={{
                borderStyle: "solid",
                borderColor: "#aaa",
                borderWidth: 1,
                borderTopWidth: 0,
                width: "100%",
                height: 5,
              }}
            />
            <div
              style={{
                height: 5,
                left: "50%",
                borderRight: "1px solid #aaa",
                position: "absolute",
              }}
            />
            <div className="text-center w-full">
              <p className="mt-2" style={{ color: "#aaa", fontSize: 14 }}>
                95% Test Confidence Interval
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResultsChart;
