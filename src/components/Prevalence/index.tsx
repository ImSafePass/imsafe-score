import React from "react";

import { PrevalencePoint } from "../../utils/nyt";

interface Model {
  lowBoundMult: number;
  highBoundMult: number;
  meanMult: number;
}

interface Props {
  cases?: number;
  models?: Model[];
  dataPoint: PrevalencePoint;
  date: Date;
  state: string;
  county: string;
}

const defaultModels: Model[] = [
  {
    lowBoundMult: 2,
    highBoundMult: 3,
    meanMult: 2.6,
  },
  {
    lowBoundMult: 4,
    highBoundMult: 8,
    meanMult: 7,
  },
  {
    lowBoundMult: 3.2,
    highBoundMult: 4.5,
    meanMult: 3.7,
  },
];

const Prevalence = ({
  models = defaultModels,
  dataPoint,
  date,
  state,
  county,
}: Props) => {
  const highestPrevalence = Math.max(...models.map((m) => m.highBoundMult));

  const lowestPrevalence = Math.min(...models.map((m) => m.lowBoundMult));

  const trackLength = highestPrevalence - lowestPrevalence;

  const { cases, deaths } = dataPoint;

  return (
    <div className="prevalence">
      <p className="m5-4">
        As of{" "}
        <span className="font-bold">{date.toISOString().split("T")[0]}</span>,
        NYT tracking data reported <span className="font-bold"> {county}</span>,{" "}
        <span className="font-bold">{state}</span> as having{" "}
        <span className="font-bold">{cases}</span> total cases, resulting in{" "}
        <span className="font-bold">{deaths}</span> deaths.
      </p>

      <div className="w-full relative h-10 bg-gray-300">
        <div className="absolute h-full" style={{ left: "5%", width: "90%" }}>
          {models.map((model) => {
            return (
              <div
                className="absolute bg-blue-200 h-full flex justify-center items-center"
                style={{
                  left: `${
                    ((model.lowBoundMult - lowestPrevalence) / trackLength) *
                    100
                  }%`,
                  width: `${
                    ((model.highBoundMult - model.lowBoundMult) / trackLength) *
                    100
                  }%`,
                  backgroundColor: `rgba(51, 65, 192, 0.2)`,
                }}
                key={model.meanMult}
              >
                <div
                  className="absolute w-5 h-5 bg-black rounded-full"
                  style={{
                    left: `${
                      ((model.meanMult - lowestPrevalence) / trackLength) * 100
                    }%`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Prevalence;
