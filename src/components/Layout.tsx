import React, { ReactChildren, ReactChild } from "react";

interface Props {
  children: ReactChildren | ReactChild;
}

const Layout = ({ children }: Props) => (
  <div className="h-screen">
    <header className="bg-blue h-20 px-8">
      <div className="flex h-full justify-between container items-center mx-auto">
        <h2>Left</h2>
        <h3>Right</h3>
      </div>
    </header>
    {children}
  </div>
);

export default Layout;
