import React, { useState, useEffect } from "react";
import Papa from "papaparse";

import { url, NytObject, arrayToStateObject, CSVRow } from "../utils/nyt";
import TestCard from "../components/TestCard";

export default () => {
  const [testNum, setTestNum] = useState(1);
  const [caseData, setCaseData] = useState<NytObject | undefined>(undefined);

  const getCaseData = () => {
    if (caseData) return;
    fetch(url)
      .then((r) => r.text())
      .then((csv) => {
        const json = Papa.parse(csv, { header: true });
        const stateObject: NytObject = arrayToStateObject(
          json.data as CSVRow[]
        );
        setCaseData(stateObject);
      });
  };

  useEffect(getCaseData);

  return (
    <div className="my-10">
      <div className="container mx-auto my10">
        {Array(testNum)
          .fill(null)
          .map((n, i) => (
            <div key={i} className="flex flex-col items-center">
              {!caseData ? "Loading" : <TestCard caseData={caseData} />}
            </div>
          ))}
      </div>
    </div>
  );
};
