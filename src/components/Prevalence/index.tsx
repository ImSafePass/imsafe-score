import React, { useState } from "react";

interface Model {
  lowBoundMult: number;
  highBoundMult: number;
  meanMult: number;
}

interface Props {
  cases?: number;
  models?: Model[];
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

const Prevalence = ({ models = defaultModels, cases = 28 }: Props) => {
  const [width, setWidth] = useState(400);
  const startX = width / 20;
  const highestPrevalence = Math.max(...models.map((m) => m.highBoundMult));

  const lowestPrevalence = Math.min(...models.map((m) => m.lowBoundMult));

  const trackLength = highestPrevalence - lowestPrevalence;

  return (
    <div
      className="prevalence w-full relative h-10 bg-gray-300"
      ref={(node) => {
        if (node) {
          setWidth(node.getBoundingClientRect().width);
        }
      }}
    >
      <div
        className="absolute h-full"
        style={{ left: startX, width: width - 2 * startX }}
      >
        {models.map((model) => {
          return (
            <div
              className="absolute bg-blue-200 h-full flex justify-center items-center"
              style={{
                left: `${
                  ((model.lowBoundMult - lowestPrevalence) / trackLength) * 100
                }%`,
                width: `${
                  ((model.highBoundMult - model.lowBoundMult) / trackLength) *
                  100
                }%`,
                backgroundColor: `rgb(51, 65, 192, 0.2)`,
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
  );
};

export default Prevalence;
