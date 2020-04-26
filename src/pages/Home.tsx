import React, { useState } from "react";

import TestCard from "../components/TestCard";

export default () => {
  const [testNum, setTestNum] = useState(1);

  return (
    <div className="my-10">
      <div className="container mx-auto my10">
        {Array(testNum)
          .fill(null)
          .map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              <TestCard />
              <button
                onClick={() => setTestNum(testNum + 1)}
                className="my-10 bg-red-600 rounded-full w-10 h-10 font-bold flex items-center justify-center hover:bg-red-700 text-white text-xl transition-colors duration-300"
              >
                <span>+</span>
              </button>
            </div>
          ))}
      </div>
      <div className="flex flex-col my-10 justify-start items-center">
        <button className="bg-blue hover:bg-blue-200 p-3 text-white rounded-md transition-colors duration-300">
          View Results
        </button>{" "}
      </div>
    </div>
  );
};
