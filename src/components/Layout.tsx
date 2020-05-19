import React, { ReactChildren, ReactChild } from "react";

import { ReactComponent as Wave } from "../assets/wave.svg";
import { ReactComponent as Illustration } from "../assets/illustration.svg";
import { ReactComponent as Logo } from "../assets/logo-white.svg";

interface Props {
  children: ReactChildren | ReactChild;
}

const Layout = ({ children }: Props) => {
  const multiple = window.innerWidth > 1200 ? 0.9 : 1;

  const heroAndWave = (
    <>
      <div className="hero py-4">
        <div className="container--small flex lg:flex-row flex-col justify-center items-center">
          <div className="flex lg:w-full w-1/2 justify-center lg:pr-8 lg:py-8 lg:my-0 my-8 z-10">
            <div className="relative">
              <Illustration
                preserveAspectRatio="xMaxYMax"
                style={{ zIndex: 1 }}
                height={227 * multiple}
                width={369 * multiple}
                viewBox="0 0 369 227"
              />
            </div>
          </div>
          <div className="flex flex-col lg:w-full w-1/2 justify-center lg:pl-8 lg:py-8 z-10 lg:mt-0 mt-4">
            <h2 className="text-white">
              How accurate are my Covid-19 test results?
            </h2>
            <h5 className="text-white mt-4">
              Gain confidence in your risk profile.
            </h5>
          </div>
        </div>
      </div>
      <div className="relative lg:-mt-20 -mt-12">
        <Wave
          style={{
            marginTop: "-1px",
          }}
          preserveAspectRatio="none"
          className="relative w-full"
        />
      </div>
    </>
  );

  return (
    <div className="h-screen">
      <div className="layout-top">
        <header className="bg-primary w-full">
          <div className="flex h-full justify-between container items-center mx-auto">
            <div className="flex flex-row items-center">
              <Logo width={35} />
              <h3 className="text-white ml-4">ImSafe Health</h3>
            </div>
          </div>
        </header>
        {false ? heroAndWave : null}
      </div>
      <div className="container--small">{children}</div>
      <div className="footer bg-black pt-2 flex items-center">
        <div
          className="container flex items-center justify-between"
          style={{ height: 40 }}
        >
          <p className="text-white m-0">
            <a
              href="https://imsafehealth.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200"
            >
              <strong>© {new Date().getFullYear()} ImSafe Health</strong>
            </a>
          </p>
          <a
            href="https://twitter.com/ImSafePass"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg
              width="20"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="twitter"
              role="img"
              viewBox="0 0 512 512"
              className=""
            >
              <path
                fill="white"
                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                className=""
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Layout;
