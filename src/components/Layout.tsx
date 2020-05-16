import React, { ReactChildren, ReactChild } from "react";

import { ReactComponent as Wave } from "../assets/wave.svg";
import { ReactComponent as Illustration } from "../assets/illustration.svg";
import { ReactComponent as Logo } from "../assets/logo-white.svg";

interface Props {
  children: ReactChildren | ReactChild;
}

const Layout = ({ children }: Props) => {
  const multiple = window.innerWidth > 1200 ? 0.9 : 1;
  return (
    <div className="h-screen">
      <div className="layout-top">
        <header className="bg-primary w-full">
          <div className="flex h-full justify-between container items-center mx-auto">
            <div className="flex flex-row items-center">
              <Logo width={35} />
              <h3 className="text-white ml-4">ImSafe Health</h3>
            </div>
            <h6>
              <a
                className="text-white hover:text-white"
                href="https://imsafehealth.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                About
              </a>
            </h6>
          </div>
        </header>
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
              <h1 className="text-white">
                How accurate are my COVID-19 test results?
              </h1>
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
      </div>
      <div className="container--small">{children}</div>
    </div>
  );
};

export default Layout;
