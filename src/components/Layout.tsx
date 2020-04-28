import React, { ReactChildren, ReactChild } from "react";

import { ReactComponent as Logo } from "../assets/logo-white.svg";

interface Props {
  children: ReactChildren | ReactChild;
}

const Layout = ({ children }: Props) => (
  <div className="h-screen">
    <header className="bg-primary h-20 px-8">
      <div className="flex h-full justify-between container items-center mx-auto">
        <div className="flex flex-row items-center">
          <Logo width={35} />
          <h3 className="text-white ml-4">ImSafe Health</h3>
        </div>
      </div>
    </header>
    {children}
  </div>
);

export default Layout;
